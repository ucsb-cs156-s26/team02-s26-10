import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { hasRole } from "main/utils/useCurrentUser";

export default function ArticlesTable({ articles, currentUser }) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/articles/edit/${cell.row.original.id}`);
  };

  const cellToAxiosParamsDelete = (cell) => ({
    url: "/api/articles",
    method: "DELETE",
    params: { id: cell.row.original.id },
  });

  const onDeleteSuccess = (message) => {
    console.log(message);
    toast(message);
  };

  // Stryker disable all : hard to test for query caching
  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/articles/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    { header: "id", accessorKey: "id" },
    { header: "Title", accessorKey: "title" },
    { header: "URL", accessorKey: "url" },
    { header: "Explanation", accessorKey: "explanation" },
    { header: "Email", accessorKey: "email" },
    { header: "Date Added", accessorKey: "dateAdded" },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(
      ButtonColumn("Edit", "primary", editCallback, "ArticlesTable"),
    );
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, "ArticlesTable"),
    );
  }

  return (
    <OurTable data={articles} columns={columns} testid={"ArticlesTable"} />
  );
}
