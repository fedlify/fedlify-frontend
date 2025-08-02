import { useTranslate, type HttpError } from "@refinedev/core";
import { List, useTable } from "@refinedev/antd";
import { Table } from "antd";
import type { ICategory } from "../interfaces";
import {
  PaginationTotal,
} from "../../../components";

export const CategoryList = () => {
  const { tableProps } = useTable<ICategory, HttpError>();

  const t = useTranslate();

  return (
    <List>
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{
          x: true,
        }}
        pagination={{
          ...tableProps.pagination,
          hideOnSinglePage: true,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="categories" />
          ),
        }}
      >
        <Table.Column
          key="title"
          dataIndex="title"
          width={224}
          title={t("categories.fields.title")}
        />
        
      </Table>
    </List>
  );
};
