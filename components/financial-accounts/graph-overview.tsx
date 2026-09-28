
interface GraphOverviewProps {
    data: {
        weeklytotal: Array<{ day: string; total: number }>;
        monthlytotal: Array<{ month: string; total: number }>;
        accountDonutData: Array<{ name: string; total: number }>;
    }
}

export default function GraphOverview({data}: GraphOverviewProps){
    return (
        <>
            
            <div>hello world</div>
        </>
    )
}