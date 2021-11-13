import React from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/client";
import { Badge, Typography, Card, Button, Input } from "@supabase/ui";
import Link from 'next/link'
import Meta from '../components/Favicons'

export default function Home() {
  const [session] = useSession();

  return (
    <div className='dark'>
      <Meta />
      <div style={{position: "relative", marginLeft: -10, marginBottom: 10}} >
        <Image alt="Fonoster Logo" width="150px" height="40px" src="/logo-dark.svg" />
      </div>
      <div className="bg-white dark:bg-gray-800">
        {!session ? (
          <>
            <div style={{width: "450px"}}> 
              <Badge dot>Open to Github Sponsors</Badge>
              <Typography.Title level={2}>
                Ready to engage your clients better, faster?
              </Typography.Title>
              <Typography.Title level={4} type="secondary">
                <span style={{ color: '#bbbbbb' }}>
                  Create a smart voice applications that meets your business needs
                  without the clutter of unneeded features or historically 
                  burdensome customizations.
                </span>
              </Typography.Title>
              <br />
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
            <Card style={{ width: "450px" }} title={`${session.user.name}`}>
              <Input label="Endpoint" value={session.endpoint} copy />
              <br />
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
