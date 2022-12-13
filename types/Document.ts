export interface Document {
    id: string;
    name: string;
    description: string;
    created_at: Date;
    must_be_finished_at: Date;
    finished_at: Date;
    executor_id: string;
}

export interface Executor {
    id: string;
    name_of_department: string;
    name_of_executor: string;
    position: string;
    document_id: string;
}