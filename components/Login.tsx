import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, LiteralUnion, signIn } from "next-auth/react";
import Image from "next/image";

interface Props {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
}

const Login = ({ providers }: Props) => {
  return (
    <div className="flex flex-col space-y-20 pt-48">
        <Image
            src="/images/firemania_white.png"
            width={170}
            height={50}
            objectFit="contain"
            priority
        />
        <div className="space-y-5">
            {Object.values(providers!).map(provider => (
                provider.name.toLocaleLowerCase() === "google" ? (
                    <div key={provider.name} className="flex justify-center">                    
                        <button aria-label="Continue with google" role="button" className="focus:outline-none  focus:ring-2 focus:ring-offset-1
                        focus:ring-gray-700 relative inline-flex items-center justify-start px-5 py-3 overflow-hidden font-bold rounded-lg group bg-white"
                        onClick={() => signIn(provider.id, { callbackUrl: "/"})}>
                            <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                            <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out
                            rotate-45 -translate-x-56 -translate-y-24 bg-blue-400 opacity-100 group-hover:-translate-x-8"></span>
                            <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg" className="z-50" alt="google"/>  
                            <span className="relative w-full text-left text-gray-700 ml-3 transition-colors duration-200 ease-in-out group-hover:text-gray-900">Continue with Google</span>
                        </button>
                    </div>
                ) : provider.name.toLocaleLowerCase() === "github" ? (
                    <div key={provider.name} className="flex justify-center"> 
                        <button aria-label="Continue with google" role="button" className="focus:outline-none  focus:ring-2 focus:ring-offset-1
                        focus:ring-gray-700 relative inline-flex items-center justify-start px-5 py-3 overflow-hidden font-bold rounded-lg group bg-white"
                        onClick={() => signIn(provider.id, { callbackUrl: "/"})}>
                            <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                            <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out
                            rotate-45 -translate-x-56 -translate-y-24 bg-blue-400 opacity-100 group-hover:-translate-x-8"></span>
                            <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg3.svg" className="z-50" alt="github"/>  
                            <span className="relative w-full text-left text-gray-700 ml-3 transition-colors duration-200 ease-in-out group-hover:text-gray-900">Continue with GitHub</span>
                        </button>
                    </div>
                ) : (
                    <div key={provider.name} className="flex justify-center"> 
                        <button aria-label="Continue with email" role="button" className="focus:outline-none  focus:ring-2 focus:ring-offset-1 focus:ring-gray-700
                        py-3.5 px-4 border rounded-lg border-gray-700 flex items-center mt-4 bg-white" onClick={() => signIn(provider.id, { callbackUrl: "/"})}>                           
                            <p className="text-base font-medium ml-4 text-gray-700">Continue with {provider.name}</p>
                        </button>
                    </div>
                )
            ))}
        </div>
    </div>
  )
}

export default Login;