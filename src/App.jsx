import { useState } from "react";
import data from "./Data/Scpdata.json";
import SCPCard from "./Components/SCPCard";
import "./App.css";


function App(){


const [search,setSearch] = useState("");

const [filter,setFilter] = useState("All");

const [selected,setSelected] = useState(null);



const filtered = data.filter((scp)=>{


return (

scp.id.toLowerCase()
.includes(search.toLowerCase())

&&

(
filter==="All"
||
scp.class===filter
)

)


});



return (

<div className="container">


<h1>
☣ SCP FOUNDATION DATABASE
</h1>


<p className="subtitle">
Secure. Contain. Protect.
</p>



<input

className="search"

placeholder="Search SCP..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>



<div className="filters">


<button onClick={()=>setFilter("All")}>
All
</button>


<button onClick={()=>setFilter("Safe")}>
Safe
</button>


<button onClick={()=>setFilter("Euclid")}>
Euclid
</button>


</div>



{

selected ?


<div className="detail">


<button
onClick={()=>setSelected(null)}
>
← Back
</button>



<h2>
{selected.id}
</h2>


<h3>
Object Class:
{selected.class}
</h3>



{

selected.image &&

<img 
src={selected.image}
alt={selected.id}
/>

}



<h3>
Special Containment Procedures
</h3>

<p>
{selected.containment}
</p>



<h3>
Description
</h3>

<p>
{selected.description}
</p>



<h3>
Reference
</h3>

<p>
{selected.reference}
</p>


</div>



:


<div className="cards">


{

filtered.map((scp)=>(

<SCPCard

key={scp.id}

scp={scp}

click={()=>setSelected(scp)}

/>

))

}


</div>


}



</div>

)

}


export default App;