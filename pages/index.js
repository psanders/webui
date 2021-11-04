import React from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/client";
import { Badge, Typography, Card, Button, Input } from "@supabase/ui";
import Link from 'next/link'

export default function Home() {
  const [session] = useSession();

  return (
    <div className='dark'>
      <Image alt="Fonoster Logo" width="150px" height="40px" src="/logo-dark.svg" />
      <div className="bg-white dark:bg-gray-800">

        <br />
        {!session ? (
          <>
            <div style={{width: "450px"}}> 
              <Typography.Title level={2}>
                Ready to engage your clients better, faster?
              </Typography.Title>
              <Badge dot>Available for Individual Github Sponsors</Badge>
              <br/> <br/>
              <Typography.Title level={4} type="secondary">
                <span style={{ color: '#bbbbbb' }}>
                  Create a smart voice applications that meets your business needs
                  without the clutter of unneeded features or historically 
                  burdensome customizations.
                </span>
              </Typography.Title>
              <Button onClick={() => signIn("github")}>
                Sign in with Github
              </Button> <Link 
                href="https://learn.fonoster.com" 
                as="https://learn.fonoster.com" passHref>
                  <Button type="default">Documentation</Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <Card style={{ width: "450px" }} title={`${session.user.name} -  ${session.user.email}`}>
              <Input label="Access Key Id" value={session.user.accessKeyId} copy />
              <br />
              <Input label="Access Key Secret" value={session.user.accessKeySecret} reveal copy />
              <br />
              <Button onClick={signOut}>Logout</Button> <Link 
                href="https://learn.fonoster.com" 
                as="https://learn.fonoster.com" passHref>
                  <Button type="default">Documentation</Button>
              </Link>
            </Card>
            <br />
          </>
        )}
      </div>
    </div>
  );
}