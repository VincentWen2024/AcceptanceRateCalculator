import React, {useState} from "react";

function Calculator() {
    const [schools, setSchools] = useState([]);
    const [newSchool, setNewSchool] = useState("");
    const [newAcceptanceRate, setNewAcceptanceRate] = useState('');
    const [allDenyRate, setAllDenyRate] = useState(0)
    const [anyAccRate, setAnyAccRate] = useState(0)
    const [operatingSchool, setOperatingSchool] = useState([])

    function handleInputChange(event) {
        let {name, value} = event.target;
        if (name === "schoolName") {
            setNewSchool(value);
        } else if (name === "acceptanceRate") {
            if (value.length > 3){
                value = value.substring(0,2)
            }
            setNewAcceptanceRate(value.replace("%", "") + "%");
        }
    }

    function handleCheckBoxChange(event) {
        const {name, checked} = event.target;
        const index = parseInt(name, 10);
        const selectedSchool = schools[index];

        setOperatingSchool(prev => {
            if (checked) {
                return [...prev, selectedSchool];
            } else {
                return prev.filter(school => school.name !== selectedSchool.name);
            }
        });
    }

    function converRate(rate) {
        return (rate * 100).toString().substring(0, 5) + "%";
    }

    function calculateRate(selectedSchools) {
        let sum = 1;
        for (let i = 0; i < selectedSchools.length; i++) {
            let denyRate = ((100 - (selectedSchools[i].accrate.replace("%", ""))) / 100);
            sum *= denyRate;
        }
        return sum;
    }

    function addSchool() {
        if (newAcceptanceRate.trim() !== "") {
            const schoolName = newSchool.trim() !== "" ? newSchool : "untitled";
            let school = {name: schoolName, accrate: newAcceptanceRate};
            setSchools(s => {
                const updatedSchools = [...s, school];
                return updatedSchools;
            });
            setOperatingSchool((s) => [...s, school])

            setNewSchool("");
            setNewAcceptanceRate('');
        }
    }

    function deleteSchool(index) {
        setSchools((s) => {
            let updatedSchools = s.filter((_, i) => index !== i);
            return updatedSchools;
        });
        setOperatingSchool(prev => prev.filter((_, i) => i !== index));
    }

    React.useEffect(() => {
        const newDenyRate = calculateRate(operatingSchool);
        setAllDenyRate(converRate(newDenyRate));
        setAnyAccRate(converRate(1 - newDenyRate));
    }, [operatingSchool]);  // 添加 schools 作为依赖项

    return (
        <div className="school-list">
            <h1>AcceptanceRateCalculator</h1>
            <p>请根据对自己学术能力的了解，预估每个学校对自己的录取率。计算器将根据你的预估数值，计算出被全部拒绝的概率和被至少一所学校录取的概率。学校名称非必填项。</p>
            <div className={"input-group"}>
                <input
                    name={"schoolName"}
                    type={"text"}
                    placeholder={"School name"}
                    value={newSchool}
                    onChange={handleInputChange}
                />
                <input
                    name={"acceptanceRate"}
                    type={"text"}
                    placeholder={"Estimated acceptance rate"}
                    value={newAcceptanceRate}
                    onChange={handleInputChange}
                />
                <button
                    className={"add-button"}
                    onClick={addSchool}>
                    add
                </button>
            </div>
            {/*学校列表部分*/}
            <ul>
                <li className={"school-list-li"}>
                    <span>School</span>
                    <span>Acceptance Rate</span>
                    <span>
                        <button className={"delete-button"}
                                style={{
                                    backgroundColor: "rgba(0, 0, 0, 0)",
                                    color: "rgba(0, 0, 0, 0)"
                                }}>Delete
                        </button>
                    </span>
                </li>
                {/*每个学校*/}
                {schools.map((element, index) =>
                    <li key={index} className={"school-list-li"}>
                        <input
                            type="checkbox"
                            id="option"
                            name={index}
                            checked={operatingSchool.includes(element)}
                            onChange={handleCheckBoxChange}
                        />
                        <span>{element.name}</span>
                        <span>{element.accrate}</span>
                        <span>
                            <button className={"delete-button"} onClick={() => deleteSchool(index)}>Delete</button>
                        </span>
                    </li>
                )}
            </ul>
            <div className={"all-deny-rate"}>
                <div>AllRejectRate</div>
                <div>{allDenyRate}</div>
                <div>Accepted by at least one school rate</div>
                <div>{anyAccRate}</div>
            </div>
        </div>
    )
}

export default Calculator;