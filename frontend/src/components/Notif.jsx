export default function Notif({message,type}){

    return(
        <>
            {message && <h3 className={type==='success'?"message success":"message fail"}>{message}</h3>}
        </>
    )
}