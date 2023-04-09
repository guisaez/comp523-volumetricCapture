import Link from "next/link";

const LandingPage = ( { currentUser, projects }) => {

    if(!currentUser){
        return (
            <div className="container">
                  <h1>Hello Welcome to Volumetric Capture</h1>
                  <h3>Looks like you are not logged in!</h3>
            </div>
        )
    }

    const projectsList = projects.map(project => {
        return(
            <tr key={project.id}>
                <td>{project.projectName}</td>
                <td>
                    <Link legacyBehavior href="/projects[projectId]" as={`/projects/${project.id}`}>
                        <a className="">View</a>
                    </Link>
                </td>
            </tr>
        )
    })

    return (
        <div className="container">
            <h1>Projects</h1>
            <table className="table">
                <thread>
                    <tr>
                        <th>Name</th>
                        <th>Link</th>
                    </tr>
                </thread>
                <tbody>
                    {projectsList}
                </tbody>
            </table>
        </div>
    )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {

    console.log(currentUser);
    if(currentUser){
        const { data } = await client.get('/api/projects');
        return { projects: data };
    }   
    
  
    return {};
}

export default LandingPage;