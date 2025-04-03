// src/components/ChartLegend.jsx

export default function ChartLegend({ total, posDifference, type = 1, changeDirection = "up" }) {
  const isUp = changeDirection === "up";
  const colorClass = isUp ? "fill-indigo-600" : "fill-red-600";

  if (type === 1) {
    return (
      <div className="flex justify-center mt-[10px]">
        <p className="inline-flex items-center text-sm text-gray-950">
          <svg
            className="mr-[2px] w-[16px] h-[16px] fill-orange-200"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="4" className="stroke-gray-900" strokeWidth="1" />
          </svg>
          <span className="font-bold mr-[2px]">{total}</span> (+{posDifference}) went in the right direction
        </p>
      </div>
    );
  } else if (type === 2) {
    return (
      <div className="flex justify-center mt-[10px] justify-items mb-3">


<p className="inline-flex items-center text-xs text-gray-950 mr-2">
          <svg
            className= {`w-[16px] h-[16px] ${colorClass}`}
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="4" className=""/>
          </svg>
          <span className="font-medium">Actual</span>
        </p>



<p className="inline-flex items-center text-xs text-gray-950">
          <svg
            className=" w-[16px] h-[16px] fill-gray-950"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="4" className=""/>
          </svg>
          <span className="font-medium">Target</span>
        </p>



      </div>
    );
  } else if (type === 3) {
    return (
      <div className="flex justify-center mt-[10px] justify-items">


      <p className="inline-flex items-center text-xs text-gray-950">
                <svg
                  className= {`w-[16px] h-[16px] fill-red-600`}
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <circle cx="8" cy="8" r="4" className="stroke-indigo-600" strokeWidth="2"/>
                </svg>
                <span className="font-medium">Actual</span>
              </p>
      
      
            </div>
    );
  } else {
    return null;
  }
}