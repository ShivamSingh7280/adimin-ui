import React, { useEffect, useState } from "react";
import { ADMINS_DATA_API } from "../config";
import { Button, Input, Spinner } from "reactstrap";
import ReactPagination from "../Components/ReactPagination";
import AdminTable from "../Components/AdminTable";

const AdminsPage = () => {
	const [adminsList, setAdminsList] = useState([]);
	const [displayData, setDisplayData] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const showPerPage = 10;
	const [paginate, setPaginate] = useState({ start: 1, end: 10 });

	const _fetchAdmins = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(ADMINS_DATA_API);
			const data = await response.json();
			const updatedData = data.map((item) => ({
				...item,
				idEdit: false,
			}));

			setAdminsList(updatedData);
			setDisplayData(updatedData);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log("_fetchAdmins", error);
		}
	};

	const _searchAdmin = (searchString) => {
		if (searchString?.trim()?.length) {
			const filteredAdminsList = adminsList.filter((admin) =>
				[admin?.name, admin?.email, admin?.role].some((value) =>
					value?.toLowerCase().includes(searchString.toLowerCase())
				)
			);
			setDisplayData(filteredAdminsList);
		} else {
			setDisplayData(adminsList);
		}
		setPaginate({ start: 1, end: 10 });
	};

	const _handleChange = (searchString) => {
		setSearchText(searchString);
		_searchAdmin(searchString);
	};

	const _onPaginationChange = (start, end) => {
		setPaginate({ start, end });
	};

	const _handleDelete = (id) => {
		let tempAdminsList = [...adminsList];
		const adminIndex = tempAdminsList.findIndex((admin) => admin.id === id);
		tempAdminsList.splice(adminIndex, 1);
		setAdminsList(tempAdminsList);
		setDisplayData(tempAdminsList);
	};

	const _handleEdit = (id) => {
		let tempAdminsList = [...adminsList];
		const adminIndex = tempAdminsList.findIndex((admin) => admin.id === id);
		tempAdminsList[adminIndex].isEdit = true;
		setAdminsList(tempAdminsList);
		setDisplayData(tempAdminsList);
	};

	const _handleEditChange = (inputName, e, id) => {
		let updatedText = e.target.value;
		let tempStaffList = [...adminsList];
		const adminIndex = tempStaffList.findIndex((admin) => admin.id === id);

		tempStaffList[adminIndex] = {
			...tempStaffList[adminIndex],
			[inputName]: updatedText,
		};

		setAdminsList(tempStaffList);
		setDisplayData(tempStaffList);
	};

	const _handleSave = (e, id, updatedText) => {
		e.preventDefault();
		let tempAdminsList = [...adminsList];
		const adminIndex = tempAdminsList.findIndex((admin) => admin.id === id);
		tempAdminsList[adminIndex] = updatedText;
		tempAdminsList[adminIndex].isEdit = false;
		setAdminsList(tempAdminsList);
		setDisplayData(tempAdminsList);
	};

	const _extractedList = () => {
		const list = [...displayData];
		const result = list.slice(paginate.start - 1, paginate.end);
		return result;
	};

	const _handleChecklist = (e, id) => {
		const { name, checked } = e.target;

		const tempAdminsList = displayData.map((user, index) =>
			name === "allSelect" &&
			index >= paginate.start - 1 &&
			index < paginate.end
				? { ...user, isChecked: checked }
				: user.id === id
				? { ...user, isChecked: checked }
				: user
		);

		setAdminsList(tempAdminsList);
		setDisplayData(tempAdminsList);
	};

	const _handleDeleteSelected = () => {
		const checkedItemSet = new Set();
		const updatedDisplayData = displayData.filter((item) => {
			if (item?.isChecked) {
				checkedItemSet.add(item?.id);
			}
			return !item?.isChecked;
		});

		setAdminsList((prevAdminList) =>
			prevAdminList.filter((admin) => !checkedItemSet.has(admin?.id))
		);
		setDisplayData(updatedDisplayData);
	};

	useEffect(() => {
		_extractedList();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paginate.start, paginate.end]);

	useEffect(() => {
		_fetchAdmins();
	}, []);

	return (
		<>
			<div>
				<Input
					type="text"
					id="searchBarContainer"
					placeholder="Search by Role, ID or Email"
					value={searchText}
					onChange={(e) => _handleChange(e.target.value)}
				/>
			</div>

			{displayData?.length ? (
				<div>
					<div>
						<AdminTable
							admins={_extractedList()}
							setAdminsList={setAdminsList}
							onEdit={_handleEdit}
							onChangeHandler={_handleEditChange}
							onSave={_handleSave}
							onDelete={_handleDelete}
							onCheckListHandler={_handleChecklist}
						/>
					</div>

					<div className="footerContainer">
						<Button onClick={_handleDeleteSelected}>DELETE SELECTED</Button>
						<ReactPagination
							start={paginate.start}
							showPerPage={showPerPage}
							totalData={displayData.length}
							onPaginationChange={_onPaginationChange}
						/>
					</div>
				</div>
			) : isLoading ? (
				<div className="spinner-loader">
					<Spinner />
					<p>Loading Admins...</p>
				</div>
			) : (
				<div className="no_result">No Admins Found!</div>
			)}
		</>
	);
};

export default AdminsPage;
