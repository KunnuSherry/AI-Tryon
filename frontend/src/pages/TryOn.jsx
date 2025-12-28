import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProduct, submitTryOn } from '../api/client'
import { initFaceMesh, processImage, drawProductOverlay, closeFaceMesh } from '../utils/mediapipe'
import Navbar from '../components/Navbar'

const TryOn = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [mediaType, setMediaType] = useState('photo') // 'photo' or 'video'
  const [uploadedMedia, setUploadedMedia] = useState(null)
  const [uploadedImageElement, setUploadedImageElement] = useState(null)
  const [resultCanvas, setResultCanvas] = useState(null)
  const [faceMesh, setFaceMesh] = useState(null)
  const [error, setError] = useState('')
  const [isLiveMode, setIsLiveMode] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)

  const videoRef = useRef(null)
  const liveVideoRef = useRef(null)
  const canvasRef = useRef(null)
  const productImageRef = useRef(null)
  const sourceImageRef = useRef(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await getProduct(id)
        setProduct(result.product)
      } catch (err) {
        setError('Product not found')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }

    // Check if live mode is requested
    const mode = searchParams.get('mode')
    if (mode === 'live') {
      setIsLiveMode(true)
    }
  }, [id, searchParams])

  useEffect(() => {
    if (!product) return

    // Load product image directly (PNG already has transparent background)
    const loadProductImage = () => {
      if (!product.image?.original) return

      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        // Store the image directly - no processing needed
        productImageRef.current = img
      }
      
      img.onerror = () => {
        console.error('Error loading product image')
      }
      
      img.src = `http://localhost:5000${product.image.original}`
    }

    loadProductImage()

    // Initialize MediaPipe FaceMesh - will reuse existing instance
    const faceMeshInstance = initFaceMesh((results) => {
      if (!canvasRef.current || !sourceImageRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const sourceImage = sourceImageRef.current

      // Get source image dimensions
      const sourceWidth = sourceImage.width || sourceImage.naturalWidth || sourceImage.videoWidth || canvas.width
      const sourceHeight = sourceImage.height || sourceImage.naturalHeight || sourceImage.videoHeight || canvas.height

      // Set canvas size
      canvas.width = sourceWidth
      canvas.height = sourceHeight

      // Clear canvas completely (no background fill) - ensures transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw the original image first (don't mirror canvas - landmarks need correct coordinates)
      ctx.drawImage(sourceImage, 0, 0, sourceWidth, sourceHeight)

      // Draw product overlay if landmarks detected
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const productImage = productImageRef.current
        
        if (productImage && productImage.complete) {
          // Draw product overlay (single PNG image used for both earrings or glasses)
          drawProductOverlay(
            canvas,
            productImage,
            results.multiFaceLandmarks[0],
            product.category,
            sourceWidth,
            sourceHeight
          )
        }
      }
    })

    setFaceMesh(faceMeshInstance)

    return () => {
      // Don't close here - let it be reused
      // Only close on component unmount
    }
  }, [product])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeFaceMesh()
    }
  }, [])

  // Handle live camera mode
  useEffect(() => {
    if (!isLiveMode || !product || !faceMesh || !liveVideoRef.current) return

    let animationFrameId = null
    let isProcessing = false

    const startLiveCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' }
        })
        
        liveVideoRef.current.srcObject = stream
        setCameraStream(stream)
        sourceImageRef.current = liveVideoRef.current

        // Process video frames continuously with throttling
        const processFrame = () => {
          if (!isLiveMode || !liveVideoRef.current) {
            if (animationFrameId) {
              cancelAnimationFrame(animationFrameId)
            }
            return
          }

          if (liveVideoRef.current.readyState === liveVideoRef.current.HAVE_ENOUGH_DATA && !isProcessing) {
            isProcessing = true
            processImage(faceMesh, liveVideoRef.current)
            // Throttle to ~30fps instead of 60fps
            setTimeout(() => {
              isProcessing = false
              animationFrameId = requestAnimationFrame(processFrame)
            }, 33) // ~30fps
          } else {
            animationFrameId = requestAnimationFrame(processFrame)
          }
        }

        liveVideoRef.current.onloadedmetadata = () => {
          liveVideoRef.current.play()
          processFrame()
        }
      } catch (err) {
        console.error('Error accessing camera:', err)
        setError('Failed to access camera. Please allow camera permissions.')
        setIsLiveMode(false)
      }
    }

    startLiveCamera()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
        setCameraStream(null)
      }
    }
  }, [isLiveMode, product, faceMesh])

  const stopLiveCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setIsLiveMode(false)
    if (liveVideoRef.current) {
      liveVideoRef.current.srcObject = null
    }
  }

  const handleMediaUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type.startsWith('image/')) {
      setMediaType('photo')
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedMedia(event.target.result)
      }
      reader.readAsDataURL(file)
    } else if (file.type.startsWith('video/')) {
      setMediaType('video')
      const url = URL.createObjectURL(file)
      setUploadedMedia(url)
      if (videoRef.current) {
        videoRef.current.src = url
      }
    }
  }

  const handleProcessTryOn = async () => {
    if (!uploadedMedia || !product || !faceMesh) {
      setError('Please upload a photo or video first')
      return
    }

    setProcessing(true)
    setError('')

    try {
      // Load product image first (ensure it's loaded before processing)
      const productImg = new Image()
      productImg.crossOrigin = 'anonymous'
      
      productImg.onload = () => {
        // Store the image directly - no processing needed (PNG already has transparent background)
        productImageRef.current = productImg

        // Process the uploaded media
        if (mediaType === 'photo') {
          const imgElement = new Image()
          imgElement.crossOrigin = 'anonymous'
          
          imgElement.onload = async () => {
            try {
              // Store reference to source image
              sourceImageRef.current = imgElement
              
              // Process with MediaPipe - this will trigger the callback
              processImage(faceMesh, imgElement)
              
              // Wait a bit for MediaPipe to process
              setTimeout(async () => {
                // Submit try-on to backend
                try {
                  const response = await fetch(uploadedMedia)
                  const blob = await response.blob()
                  await submitTryOn(product.id, blob)
                } catch (err) {
                  console.error('Error submitting try-on:', err)
                }
                
                setProcessing(false)
              }, 1000) // Increased timeout for MediaPipe processing
            } catch (err) {
              console.error('Error processing image:', err)
              setError('Failed to process image. Please try again.')
              setProcessing(false)
            }
          }
          
          imgElement.onerror = () => {
            setError('Failed to load uploaded image')
            setProcessing(false)
          }
          
          imgElement.src = uploadedMedia
        } else if (mediaType === 'video' && videoRef.current) {
          sourceImageRef.current = videoRef.current
          videoRef.current.play()
          let frameCount = 0
          const maxFrames = 150 // ~5 seconds at 30fps
          
          const processFrame = async () => {
            if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended && frameCount < maxFrames) {
              processImage(faceMesh, videoRef.current)
              frameCount++
              requestAnimationFrame(processFrame)
            } else {
              // Submit try-on to backend
              try {
                const formData = new FormData()
                formData.append('productId', product.id)
                await submitTryOn(product.id, new Blob())
              } catch (err) {
                console.error('Error submitting try-on:', err)
              }
              setProcessing(false)
            }
          }
          processFrame()
        }
      }
      
      productImg.onerror = () => {
        setError('Failed to load product image')
        setProcessing(false)
      }
      
      productImg.src = `http://localhost:5000${product.image.original}`
    } catch (err) {
      setError(err.message || 'Failed to process try-on')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#302649] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#302649] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#302649] text-white">
      <Navbar />
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 text-white/70 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Info */}
            <div className="glass-panel p-6 rounded-lg">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <div className="aspect-square bg-white/10 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                {product.image?.original ? (
                  <>
                    <img
                      ref={productImageRef}
                      src={`http://localhost:5000${product.image.original}`}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      style={{ display: 'none' }} // Hidden, used for overlay
                    />
                    <img
                      src={`http://localhost:5000${product.image.original}`}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </>
                ) : (
                  <span className="text-white/50">No Image</span>
                )}
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-white/70 capitalize">Category: {product.category}</p>
                <p className="text-2xl font-bold text-purple-400">${product.price}</p>
                <p className="text-white/70">👁️ {product.tryOnCount} try-ons</p>
                {product.description && (
                  <p className="text-white/80">{product.description}</p>
                )}
              </div>
            </div>

            {/* Try-On Section */}
            <div className="glass-panel p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Virtual Try-On</h2>

              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {!isLiveMode ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Upload Photo or Video
                      </label>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleMediaUpload}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                      />
                      <p className="text-xs text-white/70 mt-1">
                        Upload a photo (primary) or 5-second video (secondary)
                      </p>
                    </div>

                    <button
                      onClick={() => setIsLiveMode(true)}
                      className="w-full bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Try Live
                    </button>

                    {uploadedMedia && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Original Media</h3>
                          {mediaType === 'photo' ? (
                            <img
                              src={uploadedMedia}
                              alt="Uploaded"
                              className="w-full rounded-lg border border-white/20"
                            />
                          ) : (
                            <video
                              ref={videoRef}
                              src={uploadedMedia}
                              controls
                              className="w-full rounded-lg border border-white/20"
                            />
                          )}
                        </div>

                        <button
                          onClick={handleProcessTryOn}
                          disabled={processing}
                          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          {processing ? 'Processing...' : 'Try On'}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Live Camera</h3>
                      <video
                        ref={liveVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full rounded-lg border border-white/20"
                        style={{ transform: 'scaleX(-1)' }} // Mirror effect
                      />
                    </div>
                    <button
                      onClick={stopLiveCamera}
                      className="w-full bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Stop Camera
                    </button>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-2">Try-On Result</h3>
                  <canvas
                    ref={canvasRef}
                    className="w-full rounded-lg border border-white/20"
                    style={{ 
                      display: 'block', 
                      backgroundColor: 'transparent',
                      transform: isLiveMode ? 'scaleX(-1)' : 'none' // Mirror canvas for live mode to match video
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TryOn

