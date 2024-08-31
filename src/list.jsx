function List(){
    const meds = [
        {id:"1",name:"舍曲林"},
        {id:"2",name:"喹硫平"},
        {id:"3",name:"奥氮平"}
    ];

    const medItems = meds.map(meds => <li key={meds.id}>{meds.name}</li>)
    return(<ul>{medItems}</ul>);
}

export default List