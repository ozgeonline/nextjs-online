import Link from "next/link";
import styles from "../controlsButton.module.css"

export default function SignIn_Button() {
  return (
    <Link
      href="/sign-up"
      type="submit"
      className={styles.signInButton}
      aria-label="Sign In Button"
    >
      Sign In
    </Link>
  )
}