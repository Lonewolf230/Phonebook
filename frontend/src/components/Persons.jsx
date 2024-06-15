export default function Persons(props){

    return (
        <>
            <h2>Numbers</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Number</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {props.filteredPersons.map(person => {
                        return (
                            <tr key={person.id}>
                                <td>{person.name}</td>
                                <td>{person.number}</td>
                                <td>
                                    <button className="delete-btn" onClick={() => props.deleteName(person.id,person.name)}>Delete name</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            
        </>
    )
}