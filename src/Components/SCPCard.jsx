function SCPCard({scp, click}) {

    return (

        <div className="card" onClick={click}>

            {
                scp.image &&
                <img 
                    src={scp.image}
                    alt={scp.id}
                />
            }


            <h2>
                {scp.id}
            </h2>


            <h3>
                {scp.name}
            </h3>


            <div className={`badge ${scp.class}`}>
                {scp.class}
            </div>


            <button>
                View Details
            </button>


        </div>

    )

}


export default SCPCard;