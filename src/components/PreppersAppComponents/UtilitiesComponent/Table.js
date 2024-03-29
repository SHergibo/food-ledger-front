import React, { useCallback, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function Table({ columns, customTableClass, sorting, btnSortRef, sortObject, populateSortObject, setUrlPageQueryParam, trTable, pagination, paginationInfo, goToPageUrl }) {
  const { pageIndex, setPageIndex, pageCount } = paginationInfo;
  const [ paginationInput, setPaginationInput ] = useState(null);

  useEffect(() => {
    if(pageIndex) {
      setPaginationInput(pageIndex);
    }
  }, [pageIndex])

  let btnSortLogic = useCallback((btnSort, index) => {
    let svgSort = <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path></svg>;
    let dataSetBtn = "none";

    for (const key in sortObject) {
      if(key === btnSort){
        if(sortObject[key] === "desc"){
          dataSetBtn="desc"
          svgSort = <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort-amount-down" className="svg-inline--fa fa-sort-amount-down fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M304 416h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-128-64h-48V48a16 16 0 0 0-16-16H80a16 16 0 0 0-16 16v304H16c-14.19 0-21.37 17.24-11.29 27.31l80 96a16 16 0 0 0 22.62 0l80-96C197.35 369.26 190.22 352 176 352zm256-192H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-64 128H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM496 32H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg>;
        }
        if(sortObject[key] === "asc"){
          dataSetBtn="asc"
          svgSort = <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort-amount-up" className="svg-inline--fa fa-sort-amount-up fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M304 416h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM16 160h48v304a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V160h48c14.21 0 21.38-17.24 11.31-27.31l-80-96a16 16 0 0 0-22.62 0l-80 96C-5.35 142.74 1.77 160 16 160zm416 0H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-64 128H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM496 32H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg>;
        }
      }
    }

    let buttonSort = 
    <button 
    className="btn-list-sort"
    id={`btn-${btnSort}`} 
    ref={(el) => (btnSortRef.current[index] = el)}
    data-sort={dataSetBtn}>
      {svgSort}
    </button>;

    return buttonSort;
  },[sortObject, btnSortRef]);

  const gotoPage = (page) => {
    goToPageUrl ? goToPageUrl(page) : setPageIndex(page);
  };

  const previousPage = () => {
    if (pageIndex > 1) {
      setPageIndex(currPageIndex => currPageIndex - 1);
      if(setUrlPageQueryParam) setUrlPageQueryParam(pageIndex - 1);
    }
  };

  const nextPage = async () => {
    if (pageIndex < pageCount) {
      setPageIndex(currPageIndex => parseInt(currPageIndex) + 1);
      if(setUrlPageQueryParam) setUrlPageQueryParam(parseInt(pageIndex) + 1);
    }
  };

  const inputPagination = (e) => {
    if(e.target.value > pageCount){
      setPageIndex(pageCount);
      setPaginationInput(pageCount);
      if(setUrlPageQueryParam) setUrlPageQueryParam(pageCount);
    } else if (e.target.value < 0 || e.target.value === ""){
      setPaginationInput(null);
    } else if(e.target.value === "0"){  
      setPaginationInput(1);
      setPageIndex(1);
    } else {
      setPaginationInput(e.target.value);
      setPageIndex(parseInt(e.target.value));
      if(setUrlPageQueryParam) setUrlPageQueryParam(parseInt(e.target.value));
    }
  }

  return (
    <div className="container-list-table">
      <table className="list-table">
        <thead className={`${!sorting ? "thead-no-cursor" : ""} ${customTableClass?.customThead ? customTableClass?.customThead : ""}`}>
          <tr>
            {columns.map((column, index) => {
              if (column.id !== 'action' && sorting) {
                return (
                  <th key={`${column.id}-${index}`} onClick={() => populateSortObject(column.id, index)}>
                    <span className="span-sorting">
                      {column.Header}
                      {btnSortLogic(`${column.id}-sort`, index)}
                    </span>
                  </th>
                )
              } else if(column.id === 'action') {
                return (
                  <th key={`${column.id}-${index}`}>
                    {column.Header}
                  </th>
                )
              } else {
                return (
                  <th key={`${column.id}-${index}`}>
                    <span className="span-no-sorting">{column.Header}</span>
                  </th>
                )
              }
            })}
          </tr>
        </thead>
        <tbody>
          {trTable}
        </tbody>
      </table>
      {pagination && 
        <div className="pagination">
          <div className="action-pagination">
            <button onClick={() => gotoPage(1)}>
              <FontAwesomeIcon icon="angle-double-left" />
            </button>
            <button onClick={() => previousPage()}>
              <FontAwesomeIcon icon="angle-left" />
            </button>
              <span>Page
                <input 
                type="number" 
                value={paginationInput || ''}
                min={1}
                max={paginationInfo.pageCount}
                onChange={(e) => {inputPagination(e)}}/>
                sur {paginationInfo.pageCount}
              </span>
            <button onClick={() => nextPage()}>
              <FontAwesomeIcon icon="angle-right" />
            </button>
            <button onClick={() => gotoPage(paginationInfo.pageCount)}>
              <FontAwesomeIcon icon="angle-double-right" />
            </button>
          </div>
        </div>
      }
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  customTableClass: PropTypes.object,
  sorting: PropTypes.bool,
  btnSortRef: PropTypes.object,
  sortObject: PropTypes.object,
  populateSortObject: PropTypes.func,
  trTable: PropTypes.array.isRequired,
  pagination: PropTypes.bool,
  paginationInfo: PropTypes.shape({
    pageIndex: PropTypes.number,
    setPageIndex: PropTypes.func,
    pageCount: PropTypes.number
  }),
  goToPageUrl: PropTypes.func,
}

export default Table;

