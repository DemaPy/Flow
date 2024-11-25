import getCredentialsForUser from "@/actions/credentials/getCredentialsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldIcon, ShieldOffIcon } from "lucide-react";
import React, { Suspense } from "react";
import CreateCredentialDialog from "./actions/create";

const Credentials = () => {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground">Manage your credentials</p>
        </div>
        <CreateCredentialDialog />
      </div>

      <div className="h-full py-6 space-y-8">
        <Alert>
          <ShieldIcon className="w-4 h-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription>
            All information is securely encrypted, ensuring oyur data remains
            safe
          </AlertDescription>
        </Alert>

        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  );
};

async function UserCredentials() {
  const credentials = await getCredentialsForUser();

  if (!credentials) {
    return <div>Something went wrong</div>;
  }

  if (credentials.length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <ShieldOffIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-bold">No credentials created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button to create first credential
            </p>
          </div>
          <CreateCredentialDialog triggerText="Create your first credential" />
        </div>
      </Card>
    );
  }

  return <pre>{JSON.stringify(credentials, null, 4)}</pre>;
}

export default Credentials;
