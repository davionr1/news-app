export const Pagination = ({ totalPages, currentPage, onPageChange, dataAll, data, firstDate, secondDate }) => {
   //when change searchstate reset pagenumber back to zero
   
    return (
        <div>
            <footer>
                <div className='navigation'>
                    <button onClick={() => onPageChange(currentPage - 1)} {...window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} disabled = {currentPage === 1}>
                        Prev
                    </button>
                    {/* <div className='page'>{`Page ${currentPage} of ${dataAll.pagination.totalPages} `}</div> */}
                    <div className='page'>{`Page ${currentPage} of ${firstDate && secondDate ? data.pagination.totalPages : dataAll.pagination.totalPages} `}</div>
                    <button onClick={() => onPageChange(currentPage + 1)} {...window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} disabled = {currentPage === (firstDate && secondDate ? data.pagination.totalPages : dataAll.pagination.totalPages) }>
                        Next
                    </button>
                </div>
            </footer>
        </div>
    )
}
