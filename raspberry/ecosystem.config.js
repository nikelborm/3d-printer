module.exports = {
  apps : [{
    name: "3d-printer",
    script: "npm start",
    watch: ".",
    ignore_watch: [ "node_modules", ".git" ]
  }],

  deploy : {
    production : {
      user : "ubuntu",
      host : "ubuntu",
      ref  : "origin/main",
      repo : "https://github.com/nikelborm/3d-printer",
      "pre-deploy-local": "yarn",
    }
  }
};
