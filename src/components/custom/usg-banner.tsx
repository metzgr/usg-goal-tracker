export default function UsgBanner() {
    return (
      <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-950 px-6 pt-[6px] pb-[7px] sm:before:flex-1">
  
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-[12px] text-gray-200 flex items-center leading-0">
            <img className="mr-[6px] inline size-[14px]" src="/icons/us_flag.svg" alt="U.S. Flag" />
            An official website of the U.S. government
          </p>
      
        </div>
        <div className="flex flex-1 justify-end">
         
        </div>
      </div>
    )
  }