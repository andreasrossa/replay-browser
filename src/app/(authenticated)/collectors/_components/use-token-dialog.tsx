import { useDialog } from "@/hooks/use-dialog";
import { type CollectorDTO } from "@/server/db/schema";
import { useEffect, useState } from "react";
import CollectorTokenDialog from "./dialog/collector-token-dialog";

/**
 * This hook is used to open a dialog that displays a collector's token.
 * It also handles the logic for closing the dialog and removing the token from the state and DOM when the dialog is closed.
 * @param collector - The collector to display the token for.
 * @returns An object containing the dialog component and a function to open the dialog.
 */
export default function useTokenDialog() {
  const tokenDialog = useDialog();
  const [token, setToken] = useState<{
    token: string;
    tokenExpiresAt: Date;
  } | null>(null);

  const [collector, setCollector] = useState<CollectorDTO | null>(null);

  useEffect(() => {
    if (!tokenDialog.props.open) {
      // remove token from state (and token input from DOM) when dialog is closed
      setTimeout(() => {
        setToken(null);
      }, 100);
    }
  }, [tokenDialog.props.open]);

  const dialogComponent =
    token && collector ? (
      <CollectorTokenDialog
        collector={collector}
        dialogProps={tokenDialog.props}
        token={token.token}
        tokenExpiresAt={token.tokenExpiresAt}
      />
    ) : null;

  const handleOpenTokenDialog = (token: string, collector: CollectorDTO) => {
    setToken({ token, tokenExpiresAt: collector.tokenExpiresAt });
    setCollector(collector);
    tokenDialog.trigger();
  };

  return {
    dialogComponent,
    openTokenDialog: handleOpenTokenDialog,
  };
}
