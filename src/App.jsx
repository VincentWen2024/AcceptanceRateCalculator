import Calculator from "./Calculator.jsx";
import {Analytics} from "@vercel/analytics/react"

function App() {
    return (<>
            <Calculator></Calculator>
            <Analytics></Analytics>
        </>
    )
}

export default App
