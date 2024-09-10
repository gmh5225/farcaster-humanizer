import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { VerificationLevel, IDKitWidget, solidityEncode } from '@worldcoin/idkit';
import { WORLDCOIN_APP_ID } from '../settings';
import Button from "react-bootstrap/Button";
import useVerifyProof from "../hooks/UseVerifyProof";
import { SignInButton} from "@farcaster/auth-kit";

export function Verify() {
  const [loading, setLoading] = useState(false);
  const [fid, setFid] = useState(0)

  const { verifyProof, checkVerifyProof } = useVerifyProof();


  const checkVerification = async () => {
    try {
      const result = await checkVerifyProof(fid);
      if (result) {
        alert(`Your Fid ${fid} has been verified`)
      } else{
        alert(`Your Fid ${fid} has not been verified`)
      }
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        if (e.message.includes('Error: InvalidNullifier()')) {
          alert('You Have Already Verified on this fid');
        } else alert(e.message);
      } else alert(e);
    }
  }

  const onSuccess = async (result: any) => {
    setLoading(true);
    try {
      await verifyProof(result, fid);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        if (e.message.includes('Error: InvalidNullifier()')) {
          alert('You Have Already Verified on this fid');
        } else alert(e.message);
      } else alert(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h3 style={styles.headline}>
          How to use Farcaster Humanizer
        </h3>

        <label style={styles.label}>
          Scan QR code
        </label>

      </div>

      <div style={styles.signInButton}>
        <div className="centered">
          <SignInButton
            onSuccess={({ fid, username }) =>
              setFid(Number(fid))
            }
          />
        </div>
      </div>

      <div className="text-center">
        <div>
          <label style={styles.label}>
            Verify FID with WorldId
          </label>
        </div>

        <div style={styles.worldIdVerificationDiv}>
          <IDKitWidget
            app_id={WORLDCOIN_APP_ID} // obtained from the Developer Portal
            action="verify-human" // this is your action name from the Developer Portal
            signal={
              solidityEncode(['uint256'], [fid])
            }
            onSuccess={onSuccess} // callback when the modal is closed
            verification_level={VerificationLevel.Orb}// optional, defaults to ['orb']
          >
            {({ open }) => (
                <Button
                  style={styles.worldIdButton}
                  onClick={open}
                >
                  Verify with World ID
                </Button>
              )
            }
          </IDKitWidget>
          <Modal show={loading} centered>
            <Modal.Body className="text-center">
              <h4>Processing...</h4>
              <p>Please wait while your vote is being processed</p>
            </Modal.Body>
          </Modal>
          {'  '}
        </div>
      </div>

      <div>
        <div>
          <label style={styles.label}>
            Check verification status for your FID
          </label>
        </div>

        <div style={styles.checkFidDiv} className="text-center">
          <Button
            style={styles.checkFidButton}
            onClick={checkVerification}
          >
            Check FID status
          </Button>
        </div>
      </div>

      <div style={styles.linkDiv}>
        <div className="text-center">
          <a href="https://www.npmjs.com/package/farcaster-humanizer" style={styles.link}>
            How Farcaster Humanizer works ?
          </a>
        </div>
        <div style={styles.secondLinkDiv} className="text-center">
          <a href="https://www.npmjs.com/package/farcaster-humanizer" style={styles.link}>
            Add Farcaster Humanizer to your application
          </a>
        </div>
      </div>
    </>
  );
}

export default Verify;


const styles = {
  headline: { color: "#000000" },
  label: { color: "#000000", marginTop: 20 },
  signInButton: { marginTop: 20, display: "flex" },
  worldIdVerificationDiv: {marginTop: 20},
  worldIdButton: {backgroundColor: "#7c65c1"},
  linkDiv: { marginTop: 60, display: "grid" },
  link: { color: "#000000" },
  secondLinkDiv: {marginTop: 10},
  checkFidDiv: {marginTop: 20},
  checkFidButton: {backgroundColor: "#7c65c1"}
}