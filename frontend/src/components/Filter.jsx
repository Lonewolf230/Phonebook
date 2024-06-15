

export default function Filter(props){

    return(
        <>
            Filter:<input className="filter" name='filter' value={props.value} onChange={props.onChange}/>
        </>
    )
}