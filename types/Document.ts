export interface Document {
    id: string;
    name: string;
    description: string;
    created_at: Date;
    must_be_finished_at: Date;
    finished_at: Date;
    correspond_id: string;
}

export interface Executor {
    id: string;
    name: string;
    position: string;
    phone: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    document_id: string;
}

export interface Corresponds {
    id: string;
    name_of_department: string;
    position: string;
    created_at: Date;
    updated_at: Date;
    executorId: string;
}