export default function PersonForm(props){
    return(
        <>
            <form className="form" onSubmit={props.onSubmit}>
                <div className="form-container">
                Name: <input onChange={props.onChange} value={props.newPerson.name} name='name'/>
                Phone: <input onChange={props.onChange} value={props.newPerson.number} name='number'/>
                </div>
                <div>
                <button className="add-btn"type="submit">Add</button>
                </div>
            </form>
        </>
    )
}