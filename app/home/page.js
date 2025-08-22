
import axios from "axios";



export const revalidate=0

const HomeScreen =async () => {

            const data=await Promise.all([axios.get('https://galaemalae.vercel.app/api/user'),axios.get('https://galaemalae.vercel.app/api/location?multi=all'),axios.get('https://galaemalae.vercel.app/api/courses')])

            const user=data[0].data.data
            const locations=data[1].data
            const courses=data[2].data.length
            const gu = Object.values(
                locations.reduce((acc, cur) => {
                    const gu = cur.lo_kr.split(' ')[0]
                    if (!acc[gu]) {
                        acc[gu] = { gu, count: 0, doneCount: 0 }
                    }
                    acc[gu].count += 1
                    if (cur.check_status === '1') {
                        acc[gu].doneCount += 1
                    }
                    return acc
                }, {})
            )

    return (
        //display: flex;
        //     flex-direction: column;
        //     height: 100vh;
        //     background-color: #ffffff;
        //padding: 60px 24px 24px 24px;
        //     background: linear-gradient(135deg, #496bdc, #7f2ee4);
        //     border-bottom-left-radius: 20px;
        //     border-bottom-right-radius: 20px;
        //     color:#ffffff;
        //  display: flex;
        //     justify-content: space-around;
        //     align-items: center;

        // const StatItem = styled.div`
        //     display: flex;
        //     flex-direction: column;
        //     align-items: center;
        //     gap: 4px;
        // `;
        //
        // const StatValue = styled.span`
        //     font-size: 1.5rem;
        //     font-weight: bold;
        // `;
        //
        // const StatLabel = styled.span`
        //     font-size: 0.8rem;
        //     font-weight: 500;
        // `;
        <div className={'flex flex-col h-[100dvh] bg-white'}>
            <div className={'bg-gradient-to-r from-[#866DE6] to-[#7f2ee4]  rounded-b-3xl pt-[60px] p-[24px] text-white'}>
                <div className={'grid grid-cols-3 justify-center  gap-16'}>
                    <div className={'flex flex-col items-center gap-1'}>
                        <span className={'text-2xl font-bold'}>{courses}</span>
                        <span className={'text-sm font-medium'}>생성 코스</span>
                    </div>
                    <div className={'flex flex-col items-center gap-1'}>
                        <span className={'text-2xl font-bold'}>{user.course_done}</span>
                        <span className={'text-sm font-medium'}>완료 코스</span>
                    </div>
                    <div className={'flex flex-col items-center gap-1'}>
                        <span className={'text-2xl font-bold'}>{gu.length}</span>
                        <span className={'text-sm font-medium'}>방문지역</span>
                    </div>
                </div>
            </div>

            <div style={{

                padding: 24,
                flex: 1,
                overflowY: "auto"
            }}>
                {gu.map((item, index) => (
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 12,
                        cursor:'pointer',
                    }} key={index} className={'border'}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: 'baseline',
                            marginBottom: 12
                        }} >
                            <p style={{
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                margin: 0,
                                color: '#000000'
                            }}>{item.gu}</p>
                            {/*<LocationType>{item.type}</LocationType>*/}
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                        }}>
                            <div style={{
                                flexGrow: 1,
                                height: 6,
                                backgroundColor: "#b3b3b3",
                                borderRadius: 4,
                                overflow: 'hidden',
                            }}>
                                <div
                                    style={{
                                        height: '100%',
                                        width: Math.floor((item.doneCount / item.count) * 100),
                                        borderRadius: 4,
                                    }}
                                    className={'bg-blue-500'}
                                />
                            </div>
                            <p className={'text-sm text-gray-500'}>{Math.floor((item.doneCount / item.count) * 100)}%</p>
                        </div>

                        {/*</div>*/}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeScreen;


// --- Styled Components ---




