import {ImageView} from "@/components/ImageView";

export default function MapCardView({init}) {
    console.log(init)
    return (
        <>
            <div
                className={'absolute shadow-lg z-10 bottom-8 w-[350px] bg-white/30 backdrop-blur-lg  rounded-lg border-black/30 border-[1px]  overflow-hidden'}>
                <div className={'h-36 w-full bg-blue-100 m-0 overflow-hidden relative'}>
                    <ImageView placeId={init.place_id}/>
                </div>
                <div className={'flex flex-col p-4'}>
                    <p className={'font-bold'}>{init.name} <span
                        className={'text-[12px] font-medium text-gray-600'}>{init.type}</span>
                    </p>
                    <p className={'text-gray-600 text-[13px] leading-tight'}>{init.lo_kr}</p>
                    <p className={'text-[14px] mt-1 text-gray-800'}>{init.info}</p>
                </div>
            </div>
        </>
    )
}

