import Link from 'next/link';

const Header = ({ currentUser }) => {
    
    const links = [
        !currentUser && { label: 'SignUp', href: '/auth/signup'},
        !currentUser && { label: 'SignIn', href: '/auth/signin'},
        currentUser && { label: 'SignOut', href: '/auth/signout'}
    ]
        .filter(linkConfig => linkConfig)
        .map(({ label, href}) => {
            return <li key={href} className="nav-item">
                <Link legacyBehavior href={href}>
                    <a className='nav-link'>{label}</a>
                </Link>
            </li>
        })

    return (
        <nav className="navbar navbar-light bg-light">
            <Link legacyBehavior href="/">
                <a className='navbar-brand'>Volumetric Capture</a>
            </Link>

            <div className='d-flex justify-content-end'>
                <ul className='nav d-flex align-items-center'>
                    {links}
                </ul>
            </div>
        </nav>
    )
};

export default Header;