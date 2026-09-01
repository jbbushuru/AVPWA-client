export default function Logo(){
    return(
        <>
        {/* Logo and Title */}
        <div className="hidden md:flex items-center  space-x-3">
            {/* Circular AV Logo Badge */}
            <img src="/favicon.png" alt="AV Logo" className="w-7 h-7 rounded-full" />

            {/* Text Container */}
            <div className="flex flex-col">
            <h1 
            className="text-xl font-sister text-black tracking-tight leading-tight">
                Academic Vault
            </h1>
            </div>
        </div>
        </>         
    );
}
