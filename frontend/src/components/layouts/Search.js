import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"


export default function Search() {

    const [keyword, setKeyword] = useState('')

    const location = useLocation(); //ipo endha url path la irukunu tharnum
    const navigate = useNavigate()
    const searchHandler = (e) => {
        e.preventDefault()
        navigate(`/search/${keyword}`)
        
    }

    const clearKeyword=()=>{
        setKeyword('')
    }

    useEffect(()=>{
        if(location.pathname === '/'){
            clearKeyword()
        }
    },[location])
    return (
        <form onSubmit={searchHandler}>
            <div className="input-group">

                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    id="search_field"
                    className="form-control"
                    placeholder="Enter Product Name ..."
                />
                <h1>hello</h1>
                <div className="input-group-append">
                    <button id="search_btn" className="btn" >
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>

            </div >
        </form>

    )
}