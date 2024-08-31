import React, {useState} from "react";

function SchoolList() {
    const [schools, setSchools] = useState([]);
    const [newSchool, setNewSchool] = useState("");
    const [newAcceptanceRate, setNewAcceptanceRate] = useState('');
    const [allDenyRate, setAllDenyRate] = useState(0)
    const [anyAccRate, setAnyAccRate] = useState(1)
    const [operatingSchool, setOperatingSchool] = useState([])

    function handleInputChange(event) {
        const {name, value} = event.target;
        if (name === "schoolName") {
            setNewSchool(value);
        } else if (name === "acceptanceRate") {
            setNewAcceptanceRate(value.replace("%", "") + "%");
        }
    }

    function handleCheckBoxChange(event) {
        const {name, checked} = event.target;
        const index = parseInt(name, 10);

        setOperatingSchool(prev => {
            if (checked) {
                return [...prev, schools[index]];
            } else {
                return prev.filter((_, i) => i !== index);
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
        if (newSchool.trim() !== "" && newAcceptanceRate.trim() !== "") {
            let school = {name: newSchool, accrate: newAcceptanceRate};
            setSchools(s => {
                const updatedSchools = [...s, school];
                return updatedSchools;
            });
            // setOperatingSchool((s) => [...s, school])

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
            <h1>录取概率计算器</h1>
            <div>
                <input
                    name={"schoolName"}
                    type={"text"}
                    placeholder={"输入学校"}
                    value={newSchool}
                    onChange={handleInputChange}
                />
                <input
                    name={"acceptanceRate"}
                    type={"text"}
                    placeholder={"输入录取率"}
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
                    <span>学校</span>
                    <span>录取率</span>
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
                <div>全拒概率</div>
                <div>{allDenyRate}</div>
                <div>至少一所录取概率</div>
                <div>{anyAccRate}</div>
            </div>
        </div>
    )
}

export default SchoolList;