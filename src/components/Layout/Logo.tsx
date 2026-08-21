export default function Logo(){
    return(
        <>
        {/* Logo and Title */}
        <div className="hidden md:flex items-center p-4 space-x-3 bg-[#eeede4]">
            {/* Circular AV Logo Badge */}
            <img src="/favicon.png" alt="AV Logo" className="w-8 h-8 rounded-full" />

            {/* Text Container */}
            <div className="flex flex-col">
            <h1 
            className="text-2xl font-sister text-primary tracking-tight leading-tight">
                Academic Vault
            </h1>
            </div>
        </div>
        </>         
    );
}
