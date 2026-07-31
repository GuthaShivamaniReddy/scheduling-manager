export default function ScheduleSkeleton() {
  return (
    <div className="w-fit">
      {Array.from({ length: 8 }, (_, rowIndex) => (
        <div key={rowIndex.toString()} className="flex h-11">
          <div className="flex w-56 flex-shrink-0 items-center justify-between border-b border-l border-r">
            <p className="flex-shrink-0 whitespace-nowrap py-2 pl-2"></p>
          </div>
          <div className="flex">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i.toString()}
                className="flex w-14 items-center justify-center border-b border-r py-2"
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
