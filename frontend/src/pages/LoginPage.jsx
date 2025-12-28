import React from 'react'

const LoginPage = () => {
    return (
        <div className='flex flex-col lg:flex-row w-full min-h-screen bg-[#352632]'>
            <div className='lg:w-4/6 w-full h-[40vh] lg:h-[100vh]'>
                <video src="login.mp4" autoPlay muted loop className='w-full h-full object-cover'></video>
            </div>
            <div className='glass-panel relative w-full lg:w-2/6 h-full min-h-[60vh] lg:min-h-[100vh] flex flex-col items-center justify-center gap-12 px-8 py-12'>
                <div className='text-white text-center text-3xl md:text-4xl font-bold leading-snug'>
                    Try Accessories Virtually
                </div>
                <form className='flex flex-col gap-5 w-full max-w-sm'>
                    <input type="text" placeholder="Username" className='input-field' />
                    <input type="password" placeholder="Password" className='input-field' />
                    <button type="submit" className='btn-primary'>Login</button>
                </form>
                <div className='droplet drop-one'></div>
                <div className='droplet drop-two'></div>
                <div className='droplet drop-three'></div>
            </div>
        </div>
    )
}

export default LoginPage