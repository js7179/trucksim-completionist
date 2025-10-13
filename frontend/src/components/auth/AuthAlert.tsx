import { Alert } from "@mantine/core";

export default function AuthAlertComponent({formStatus}: AuthAlertComponentProps) {
    if(!formStatus.show) return <></>;
    return (
        <Alert 
            variant='light' 
            color={formStatus.isSuccess ? 'green' : 'red'} 
            title=''
            mod={formStatus.isSuccess ? 'data-authdialog-success' : 'data-authdialog-failure'}
        >
            {formStatus.message}
        </Alert>
    );
}

type AuthAlertComponentProps = {
    formStatus: FormStatus;
};

export type FormStatus = {
    show: boolean;
    isSuccess?: boolean;
    message?: string;
};