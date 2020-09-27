// https://github.com/nodeca/js-yaml
const yaml = require('js-yaml');
const fs   = require('fs');


const core = require('@actions/core');
const github = require('@actions/github');

require('dotenv').config()

let myToken = "";

if (process.env.TOKEN)
{
   myToken = process.env.TOKEN;
}
else
{
   myToken = core.getInput('myToken');
}

let refToSearch = "";

if (process.env.refToSearch)
{
  refToSearch = process.env.refToSearch;
}
else
{
  refToSearch = core.getInput('ref-to-search');
}

let envName = "";

if (process.env.envName)
{
  envName = process.env.envName;
}
else
{
   envName = core.getInput('env-name');
}


async function listDeployments(refTag) 
{
    // This should be a token with access to your repository scoped in as a secret.
  // The YML workflow will need to set myToken with the GitHub Secret Token
  // myToken: ${{ secrets.GITHUB_TOKEN }}
  // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
  //const myToken = core.getInput('myToken');

  const octokit = github.getOctokit(myToken)

  try
  {
  //Check if milestone exists
    const { data: deployments } = await octokit.repos.listDeployments({
    owner: 'james-leha',
    repo: 'ReadingTime3',
    ref: refTag
    })

    return deployments;

  }
  catch(error) 
  {
    // Handle the promise
    console.log("ERROR listing Deployments: " + error.message)    
    return false;
  };

}

async function getDeployments(envName)
{
  var deployments = await listDeployments(refToSearch);

  console.log(deployments[0].environment);

  for(i = 0 ;i < deployments.length;i++)
  {
    if (deployments[i].environment == envName)
    {
        console.log('For environment ' + deployments[i].environment)
        const deploymentId = deployments[i].id
        console.log("Deployment ID: " +deploymentId)

        core.setOutput("deploymentId", deploymentId);
    }
    
  }


}

getDeployments(envName);