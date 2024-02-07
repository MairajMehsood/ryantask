import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {AuthContext, tokenExpireError} from "../authContext";
import {GlobalContext} from "../globalContext";
import MkdSDK from "../utils/MkdSDK";

const AdminDashboardPage = () => {
    const { dispatch } = React.useContext(AuthContext);
    const { dispatch: dispatcher} = React.useContext(GlobalContext);
    const navigate = useNavigate();
    const [page, setPage] = useState(null)
    const [data, setData] = useState([])

    const logout = async () => {
        dispatch({ type: "LOGOUT"});
        dispatcher({type: "SNACKBAR", payload: {message: "Admin logged out successfully."}})
        navigate('/admin/login');
    }

    const paginate = async (page= 1) => {
        let sdk = new MkdSDK();
        const body = {
            "payload": {},
            "page": page,
            "limit": 10
        }
        
        let newData = await sdk.callRestAPI(body, 'PAGINATE')
        if(newData){
            console.log('data', newData)
            setPage(newData)
            setData(newData.list)
        }
    }

    useEffect(() => {
        paginate();
    }, []);

  return (
    <>
      <div className="w-full flex flex-col h-screen overflow-auto">
          <div className="h-[100px] container mx-auto flex justify-between items-center">
              <div className="text-5xl text-white font-extrabold uppercase inline-flex">
                  App
              </div>
              <button type="button" className="inline-flex items-center justify-center py-3 px-8 font-light rounded-full bg-[#9bff01]" onClick={logout}>
                  Logout
              </button>
          </div>

          <div className=" container mx-auto flex justify-between items-center mt-[60px]">
              <div className="text-3xl text-white font-extralight uppercase inline-flex">
                  Today's Leaderboard
              </div>
              <div className="text-sm text-white py-2 px-4 rounded-lg font-extralight uppercase bg-[#1d1d1d] shadow shadow-[#1d1d1d] w-1/4 inline-flex items-center justify-between">
                  <span>
                      30 May 2020 &nbsp;
                  </span>
                  <span className="uppercase py-1 px-3 bg-[#9bff01] text-black rounded-lg text-xs">
                      submittion open
                  </span>
                  <span>
                      11:34
                  </span>
              </div>
          </div>

          <div className="container px-4 mx-auto flex text-gray-400 justify-between items-center capitalize mt-[20px] text-sm  mb-3">
              <span className="w-[500px] ">
                  # &nbsp; &nbsp;
                  Title
              </span>
              <span>
                  Author
              </span>
              <span>
                  Most Liked
              </span>
          </div>

          {data?.length > 0 ? (
              <>
                  {data?.map((item) => (
                      <div key={item?.id} className="container mx-auto flex justify-between items-center p-4 border capitalize mt-[20px] text-sm text-gray-400 mb-3 border-gray-500">
                          <span className="flex w-[500px] items-center justify-around gap-2">
                              {/* <span>
                                  {item?.id}</span> &nbsp; &nbsp; */}
                              <span>
                                  {item?.photo && (
                                      <img
                                          src={item?.photo}
                                          alt="photo"
                                          className="w-[90px] h-[50px] rounded-lg object-cover"
                                      />
                                  )}
                              </span>
                              <span className="font-extralight text-sm w-[300px]">
                                  {item?.title}
                              </span>
                          </span>
                          <span className="inline-flex items-center justify-center font-extralight">
                              {item?.photo && (
                                  <img src={item?.photo} alt="photo" className="w-[20px] h-[20px] rounded-full object-cover"/>
                              )}
                              &nbsp;
                              {item?.username}
                          </span>
                          <span className="font-extralight">
                              {item?.like}
                          </span>
                      </div>
                  ))}
              </>
          ) : 'no data'}

          <div className="container px-4 mx-auto flex justify-between items-center capitalize text-sm text-white mt-3">
              <button
                  type="button" className="inline-flex items-center text-black justify-center py-3 px-8 font-light rounded-full bg-[#9bff01]"
                  onClick={() => paginate(page?.page-1)}
                  disabled={page?.page == 0}
              >
                  Previous
              </button>
              <button
                  type="button" className="inline-flex items-center text-black justify-center py-3 px-8 font-light rounded-full bg-[#9bff01]"
                  onClick={() => paginate(page?.page+1)}
                  disabled={page?.total == page?.page}
              >
                  Next
              </button>
          </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
