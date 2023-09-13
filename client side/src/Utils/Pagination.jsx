import React, { useEffect, useState } from "react";
import "./pagination.css";

function Pagination({
  currentPage,
  searchedEmail,
  setCurrentPage,
  users,
  displayedUsers,
  itemsPerPage,
  searchedUsers,
}) {
  const [count , setCount] = useState(0)

  useEffect(()=>{
    if (searchedUsers.length > 0 || searchedEmail.trim() !== "") setCount( Math.ceil(searchedUsers?.length / itemsPerPage));


    if (searchedUsers.length === 0 && searchedEmail.trim() === "") setCount( Math.ceil(users.length / itemsPerPage));


    if (searchedUsers.length === 0 && searchedEmail.trim() !== "") setCount(0);

  },[ searchedUsers , users , searchedEmail , count])

  const [active, setActive] = useState(1);

  return (
    
      
    <ul className="pagination">
      
      <button
        disabled={currentPage === 1}
        onClick={() => {
          setCurrentPage(currentPage - 1);
          setActive(currentPage - 1);
        }}
      >
        prev
      </button>
      {count - currentPage > 2 && currentPage - 1 > 2 && (
        <>
          <li
            className={active === 1 ? "active-page" : ""}
            onClick={() => {
              setCurrentPage(1);
              setActive(1);
            }}
          >
            1
          </li>
          {currentPage - 3 === 1 ? null : <li>...</li>}
          <li
            className={active === currentPage - 2 ? "active-page" : ""}
            onClick={() => {
              setCurrentPage(currentPage - 2);
              setActive(currentPage - 2);
            }}
          >
            {currentPage - 2}
          </li>
          <li
            className={active === currentPage - 1 ? "active-page" : ""}
            onClick={() => {
              setCurrentPage(currentPage - 1);
              setActive(currentPage - 1);
            }}
          >
            {currentPage - 1}
          </li>
          <li
            className={active === currentPage ? "active-page" : ""}
            onClick={() => {
              setActive(currentPage);
            }}
          >
            {currentPage}
          </li>
          <li
            className={active === currentPage + 1 ? "active-page" : ""}
            onClick={() => {
              setCurrentPage(currentPage + 1);
              setActive(currentPage + 1);
            }}
          >
            {currentPage + 1}
          </li>
          <li
            className={active === currentPage + 2 ? "active-page" : ""}
            onClick={() => {
              setCurrentPage(currentPage + 2);
              setActive(currentPage + 2);
            }}
          >
            {currentPage + 2}
          </li>
          {currentPage + 3 === count ? null : <li>...</li>}
          <li
            className={active === count ? "active-page" : ""}
            onClick={() => {
              setCurrentPage(count);
              setActive(count);
            }}
          >
            {count}
          </li>
        </>
      )}
      {count - currentPage <= 2 && currentPage - 1 > 2 && (
        <>
          <li
            className={active === 1 ? "active-page" : ""}
            onClick={() => {
              setCurrentPage(1);
              setActive(1);
            }}
          >
            1
          </li>
          {currentPage - 3 === 1 ? null : <li>...</li>}
          <li
            className={active === currentPage - 2 ? "active-page" : ""}
            onClick={() => {
              setCurrentPage(currentPage - 2);
              setActive(currentPage - 2);
            }}
          >
            {currentPage - 2}
          </li>
          <li
            className={active === currentPage - 1 ? "active-page" : ""}
            onClick={() => {
              setCurrentPage(currentPage - 1);
              setActive(currentPage - 1);
            }}
          >
            {currentPage - 1}
          </li>
          <li
            className={active === currentPage ? "active-page" : ""}
            onClick={() => {
              setActive(currentPage);
            }}
          >
            {currentPage}
          </li>
          {currentPage === count && null}
          {currentPage + 1 === count && null}
          {currentPage + 2 === count && (
            <li
              className={active === currentPage + 1 ? "active-page" : ""}
              onClick={() => {
                setCurrentPage(currentPage + 1);
                setActive(currentPage + 1);
              }}
            >
              {currentPage + 1}
            </li>
          )}
          {currentPage === count ? null : searchedEmail.trim() === "" && (
            <li
              className={active === count ? "active-page" : ""}
              onClick={() => {
                setCurrentPage(count);
                setActive(count);
              }}
            >
              {count}
            </li>
          )}
        </>
      )}
      {count - currentPage > 2 && currentPage - 1 <= 2 && (
        <>
          <li
            className={active === 1 ? "active-page" : ""}
            onClick={() => {
              setCurrentPage(1);
              setActive(1);
            }}
          >
            1
          </li>
          {currentPage - 1 === 1 ? null : currentPage === 1 ? null : (
            <li
              className={active === 2 ? "active-page" : ""}
              onClick={() => {
                setCurrentPage(2);
                setActive(2);
              }}
            >
              2
            </li>
          )}
          {currentPage === 1 ? null : (
            <li
              className={active === currentPage ? "active-page" : ""}
              onClick={() => {
                setCurrentPage(currentPage);
                setActive(currentPage);
              }}
            >
              {currentPage}
            </li>
          )}
          <li
            className={active === currentPage + 1 ? "active-page" : ""}
            onClick={() => {
              setCurrentPage(currentPage + 1);
              setActive(currentPage + 1);
            }}
          >
            {currentPage + 1}
          </li>
          <li
            className={active === currentPage + 2 ? "active-page" : ""}
            onClick={() => {
              setCurrentPage(currentPage + 2);
              setActive(currentPage + 2);
            }}
          >
            {currentPage + 2}
          </li>
          {currentPage + 3 === count ? null : <li>...</li>}
          <li
            className={active === count ? "active-page" : ""}
            onClick={() => {
              setCurrentPage(count);
              setActive(count);
            }}
          >
            {count}
          </li>
        </>
      )}
      {count - currentPage <= 2 &&
        currentPage - 1 <= 2 &&
        searchedEmail.trim() === "" &&
         Array(count).fill(1,0,count).map((elm , ind)=>{
          
          return(
            <>
            <li
              className={active === ind + 1 ? "active-page" : ""}
              onClick={() => {
                setCurrentPage(ind + 1);
                setActive(ind + 1);
              }}
            >
              {ind + 1}
            </li>
            </>
          )
        })
        
        }
      {/* {count === currentPage === 1 && (
        <li
          onClick={() => {
            setCurrentPage(1);
            setActive(1);
          }}
          className={active === 1 ? "active-page" : ""}
        >
          1
        </li>
      )} */}

      <button
        disabled={currentPage === count || count === 0 || count === undefined }
        onClick={() => {
          setCurrentPage(currentPage + 1);
          setActive(currentPage + 1);
        }}
      >
        next
      </button>
    </ul>
    
  
  );
}

export default Pagination;
