import React, { useState, useEffect } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const ReactPagination = (props) => {
	const { start, showPerPage, onPaginationChange, totalData } = props;
	const [counter, setCounter] = useState(1);

	useEffect(() => {
		const value = showPerPage * counter;
		onPaginationChange(value - showPerPage + 1, value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [counter]);

	const _goToPrevPage = () => {
		setCounter(counter - 1);
	};
	const _goToNextPage = () => {
		setCounter(counter + 1);
	};

	// creating array from 1 to 10
	const pageNumbers = [
		...Array(Math.ceil(totalData / showPerPage) + 1).keys(),
	].slice(1);

	let currentPageNum = parseInt(start / showPerPage) + 1;

	return (
		<Pagination>
			<PaginationItem className={currentPageNum === 1 ? "disabled" : ""}>
				<PaginationLink href="#" previous onClick={() => _goToPrevPage()} />
			</PaginationItem>

			{pageNumbers.map((num) => (
				<PaginationItem
					key={num}
					className={currentPageNum === num ? "active" : ""}
					onClick={() => setCounter(num)}>
					<PaginationLink href="#">{num}</PaginationLink>
				</PaginationItem>
			))}

			<PaginationItem
				className={
					currentPageNum === Math.ceil(totalData / showPerPage)
						? "disabled"
						: ""
				}>
				<PaginationLink href="#" next onClick={() => _goToNextPage()} />
			</PaginationItem>
		</Pagination>
	);
};

export default ReactPagination;
