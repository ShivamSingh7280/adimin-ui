import React from "react";
import { Button, Input, Table } from "reactstrap";

const AdminTable = (props) => {
	const {
		admins,
		onEdit,
		onChangeHandler,
		onDelete,
		onSave,
		onCheckListHandler,
	} = props;

	return (
		<>
			<Table striped responsive>
				<thead>
					<tr className="table-primary">
						<th scope="row">
							<Input
								type="checkbox"
								name="allSelect"
								checked={
									admins.filter((admin) => admin?.isChecked !== true).length < 1
								}
								onChange={(e) => onCheckListHandler(e)}
							/>
						</th>
						<th>NAME</th>
						<th>EMAIL</th>
						<th>ROLE</th>
						<th>ACTIONS</th>
					</tr>
				</thead>
				<tbody>
					{admins?.map((admin) => (
						<tr key={admin?.id} className="table-light">
							<th scope="row">
								<Input
									type="checkbox"
									name={admin?.name}
									checked={admin?.isChecked || false}
									onChange={(e) => onCheckListHandler(e, admin?.id)}
								/>
							</th>

							{admin?.isEdit === true ? (
								<>
									<td>
										<Input
											value={admin?.name}
											onChange={(e) => onChangeHandler("name", e, admin?.id)}
										/>
									</td>
									<td>
										<Input
											value={admin?.email}
											onChange={(e) => onChangeHandler("email", e, admin?.id)}
										/>
									</td>
									<td>
										<Input
											value={admin?.role}
											onChange={(e) => onChangeHandler("role", e, admin?.id)}
										/>
									</td>
									<td>
										<Button
											color="success"
											onClick={(e) => onSave(e, admin?.id, admin)}>
											SAVE
										</Button>
									</td>
								</>
							) : (
								<>
									<td>{admin?.name}</td>
									<td>{admin?.email}</td>
									<td>{admin?.role}</td>

									<td className="TableBtnContainer">
										<Button
											className="btn"
											color="primary"
											onClick={() => onEdit(admin?.id)}>
											EDIT
										</Button>
										<Button
											className="btn"
											color="danger"
											onClick={() => onDelete(admin?.id)}>
											DELETE
										</Button>
									</td>
								</>
							)}
						</tr>
					))}
				</tbody>
			</Table>
		</>
	);
};

export default AdminTable;
