export function PaymentIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center flex-wrap gap-2 ${className}`}>
      {/* Visa */}
      <div className="h-7 px-3 rounded-md bg-[#1A1F71] flex items-center justify-center" title="Visa">
        <span className="text-white font-black italic text-xs tracking-widest leading-none select-none">
          VISA
        </span>
      </div>

      {/* Mastercard */}
      <div className="h-7 w-12 rounded-md bg-white border border-gray-200 flex items-center justify-center" title="Mastercard">
        <div className="relative h-4" style={{ width: "30px" }}>
          <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-[#EB001B]" />
          <div className="absolute top-0 left-[14px] w-4 h-4 rounded-full bg-[#FF5F00] opacity-90" />
        </div>
      </div>

      {/* Apple Pay */}
      <div className="h-7 px-2.5 rounded-md bg-black flex items-center justify-center gap-1" title="Apple Pay">
        <svg width="11" height="13" viewBox="0 0 11 14" fill="white" aria-hidden="true">
          <path d="M5.6 2.1c.7-.9 1.3-1.8 1.2-2.7-.7.1-1.7.6-2.3 1.4-.6.7-1.1 1.6-.9 2.5.8.1 1.7-.4 2-1.2z" />
          <path d="M9 5c-.6-.5-1.3-.8-2.1-.8-.9 0-1.5.5-2.1.5s-1.1-.5-2-.5C1.4 4.2 0 5.6 0 7.9c0 1.4.5 3 1.1 4 .6.9 1.1 1.6 2 1.6.7 0 1-.5 2-.5s1.2.5 2 .5c.9 0 1.4-.7 1.9-1.5.5-.7.7-1.4.7-1.5-.1-.1-.9-.5-.9-1.6C8.8 7.6 9.8 7 9.8 7 9.3 6.3 8.5 5.9 9 5z" />
        </svg>
        <span className="text-white text-[10px] font-semibold leading-none">Pay</span>
      </div>

      {/* Google Pay */}
      <div className="h-7 px-2.5 rounded-md bg-white border border-gray-200 flex items-center justify-center gap-1" title="Google Pay">
        <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <span className="text-gray-700 text-[10px] font-semibold leading-none">Pay</span>
      </div>

      {/* Instant EFT */}
      <div className="h-7 px-2.5 rounded-md bg-white border border-gray-200 flex items-center justify-center" title="Instant EFT">
        <span className="text-gray-600 text-[10px] font-bold tracking-wide leading-none select-none">
          EFT
        </span>
      </div>

      {/* PayFast / SA generic */}
      <div className="h-7 px-2.5 rounded-md bg-[#00AEEF] flex items-center justify-center" title="PayFast">
        <span className="text-white text-[10px] font-bold tracking-wide leading-none select-none">
          PAYFAST
        </span>
      </div>
    </div>
  );
}
