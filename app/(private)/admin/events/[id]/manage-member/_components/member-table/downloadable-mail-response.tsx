import React, { useMemo } from "react";
import { utils, writeFile } from "xlsx";

import { Button } from "@/components/ui/button";
import { RiFileExcel2Fill } from "react-icons/ri";

import { TMailSendObject } from "@/types";

interface Props {
    mailResponse: TMailSendObject;
}

const DownloadableMailResponse = ({
    mailResponse: { errorSend, successSend },
}: Props) => {
    const normalizedData = useMemo(() => {
        return [...errorSend, ...successSend];
    }, [errorSend, successSend]);

    const exportToExcel = () => {
        const modifiedAttendance = normalizedData.map((sendEntry) => {
            return {
                EMAIL: sendEntry.to,
                "SENT STATUS": sendEntry.success ? "Sent" : "Failed",
                "REJECT REASON": sendEntry.success ? "" : sendEntry.reason,
                "REJECT DESCRIPTION": sendEntry.success
                    ? ""
                    : sendEntry.reasonDescription,
            };
        });
        var wb = utils.book_new();
        var ws = utils.json_to_sheet(modifiedAttendance);
        utils.book_append_sheet(wb, ws, "Email Sent Logs");
        writeFile(wb, `otp-email-sent-logs-${+new Date()}.xlsx`);
    };

    return (
        <div className="flex flex-col space-y-2 w-full">
            <p className="text-muted-foreground/70">
                Email Sent :{" "}
                <span className="text-foreground">{successSend.length}</span>
            </p>
            <p className="text-muted-foreground/70">
                Failed Sent :{" "}
                <span className="text-foreground">{errorSend.length}</span>
            </p>
            <Button
                size="sm"
                variant="outline"
                onClick={() => exportToExcel()}
                className="size-fit px-2 py-1 self-end"
            >
                Download Sent Logs{" "}
                <RiFileExcel2Fill className="text-primary ml-2" />
            </Button>
        </div>
    );
};

export default DownloadableMailResponse;
