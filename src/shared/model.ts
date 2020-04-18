export interface ITransactionManagerAccessRights {
  name: string;
  shortName: string;
  moduleId: string;
  description: string;
  accessRights: IAccessRights[];
  type: string;
  createdBy: string;
  updatedBy: string;
  updatedDate: string;
  createdDate: string;
  status: boolean;
}

export interface IAccessRights {
  name: string;
  shortName: string;
  status: boolean;
  permission: IPermission[];
}
export interface IGetDocumentResponse<T> {
  cas: string;
  value: T;
}

export interface IPermission {
  path: string;
  method: string;
}
export interface IUser {
  id: number;
  name: string;
  age: number;
  city: string;
}
export interface IEmployee {
  id: string;
  name: string;
  age: number;
  city: string;
  type: string;
}
export interface IScript {
  id: string;
  type: string;
  developer_name: string;
  script_type: string;
  script_location: string;
  release: string;
  jira_issue: string;
  script_description: string;
  script_content: string;
  status: boolean;
}
