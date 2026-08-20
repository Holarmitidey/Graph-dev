CREATE
(:Developer {
    id: 'dev_001',
    name: 'Alice Johnson',
    title: 'Backend Engineer',
    bio: 'Backend engineer focused on scalable APIs and distributed systems.',
    location: 'Lagos, Nigeria',
    experienceYears: 4
}),
(:Developer {
    id: 'dev_002',
    name: 'David Williams',
    title: 'Full Stack Engineer',
    bio: 'Full stack developer building modern web applications.',
    location: 'Abuja, Nigeria',
    experienceYears: 3
}),
(:Developer {
    id: 'dev_003',
    name: 'Sarah Adeyemi',
    title: 'Software Engineer',
    bio: 'Software engineer interested in cloud infrastructure and backend systems.',
    location: 'Ibadan, Nigeria',
    experienceYears: 5
}),
(:Developer {
    id: 'dev_004',
    name: 'Michael Okafor',
    title: 'Frontend Engineer',
    bio: 'Frontend engineer specializing in React and TypeScript.',
    location: 'Lagos, Nigeria',
    experienceYears: 3
});

CREATE
(:Skill {id: 'skill_python', name: 'Python', category: 'Programming Language'}),
(:Skill {id: 'skill_javascript', name: 'JavaScript', category: 'Programming Language'}),
(:Skill {id: 'skill_typescript', name: 'TypeScript', category: 'Programming Language'}),
(:Skill {id: 'skill_react', name: 'React', category: 'Frontend'}),
(:Skill {id: 'skill_nodejs', name: 'Node.js', category: 'Backend'}),
(:Skill {id: 'skill_nestjs', name: 'NestJS', category: 'Backend'}),
(:Skill {id: 'skill_postgresql', name: 'PostgreSQL', category: 'Database'}),
(:Skill {id: 'skill_redis', name: 'Redis', category: 'Database'}),
(:Skill {id: 'skill_docker', name: 'Docker', category: 'DevOps'}),
(:Skill {id: 'skill_aws', name: 'AWS', category: 'Cloud'});

CREATE
(:Technology {id: 'tech_fastapi', name: 'FastAPI', category: 'Backend Framework'}),
(:Technology {id: 'tech_django', name: 'Django', category: 'Backend Framework'}),
(:Technology {id: 'tech_react', name: 'React', category: 'Frontend Framework'}),
(:Technology {id: 'tech_nextjs', name: 'Next.js', category: 'Frontend Framework'}),
(:Technology {id: 'tech_nestjs', name: 'NestJS', category: 'Backend Framework'}),
(:Technology {id: 'tech_postgresql', name: 'PostgreSQL', category: 'Database'}),
(:Technology {id: 'tech_mongodb', name: 'MongoDB', category: 'Database'}),
(:Technology {id: 'tech_redis', name: 'Redis', category: 'Database'}),
(:Technology {id: 'tech_docker', name: 'Docker', category: 'DevOps'}),
(:Technology {id: 'tech_aws', name: 'AWS', category: 'Cloud'});

CREATE
(:Project {
    id: 'project_remitcompare',
    name: 'RemitCompare',
    description: 'A platform for comparing international remittance providers.',
    type: 'FinTech'
}),
(:Project {
    id: 'project_studyhack',
    name: 'StudyHack',
    description: 'An AI-powered learning and quiz platform.',
    type: 'EdTech'
}),
(:Project {
    id: 'project_maize',
    name: 'Maize Intelligence',
    description: 'An agricultural intelligence platform for pest detection.',
    type: 'AgriTech'
}),
(:Project {
    id: 'project_marketplace',
    name: 'Local Marketplace',
    description: 'A marketplace connecting local buyers and sellers.',
    type: 'E-Commerce'
});

CREATE
(:Company {
    id: 'company_paystack',
    name: 'Paystack',
    industry: 'FinTech',
    location: 'Lagos, Nigeria'
}),
(:Company {
    id: 'company_flutterwave',
    name: 'Flutterwave',
    industry: 'FinTech',
    location: 'Lagos, Nigeria'
}),
(:Company {
    id: 'company_andela',
    name: 'Andela',
    industry: 'Technology',
    location: 'Remote'
}),
(:Company {
    id: 'company_techcorp',
    name: 'TechCorp',
    industry: 'Software',
    location: 'Lagos, Nigeria'
});

CREATE
(:Job {
    id: 'job_backend_001',
    title: 'Backend Engineer',
    description: 'Build scalable backend services and APIs.',
    location: 'Lagos, Nigeria',
    employmentType: 'Full-time'
}),
(:Job {
    id: 'job_fullstack_001',
    title: 'Full Stack Engineer',
    description: 'Build and maintain full stack web applications.',
    location: 'Remote',
    employmentType: 'Full-time'
}),
(:Job {
    id: 'job_cloud_001',
    title: 'Cloud Backend Engineer',
    description: 'Build backend systems deployed on cloud infrastructure.',
    location: 'Remote',
    employmentType: 'Full-time'
});

MATCH
    (alice:Developer {id: 'dev_001'}),
    (python:Skill {id: 'skill_python'}),
    (postgresql:Skill {id: 'skill_postgresql'}),
    (docker:Skill {id: 'skill_docker'}),
    (redis:Skill {id: 'skill_redis'})
CREATE
    (alice)-[:HAS_SKILL]->(python),
    (alice)-[:HAS_SKILL]->(postgresql),
    (alice)-[:HAS_SKILL]->(docker),
    (alice)-[:HAS_SKILL]->(redis);

MATCH
    (david:Developer {id: 'dev_002'}),
    (js:Skill {id: 'skill_javascript'}),
    (ts:Skill {id: 'skill_typescript'}),
    (react:Skill {id: 'skill_react'}),
    (node:Skill {id: 'skill_nodejs'})
CREATE
    (david)-[:HAS_SKILL]->(js),
    (david)-[:HAS_SKILL]->(ts),
    (david)-[:HAS_SKILL]->(react),
    (david)-[:HAS_SKILL]->(node);

MATCH
    (sarah:Developer {id: 'dev_003'}),
    (python:Skill {id: 'skill_python'}),
    (nestjs:Skill {id: 'skill_nestjs'}),
    (aws:Skill {id: 'skill_aws'}),
    (docker:Skill {id: 'skill_docker'})
CREATE
    (sarah)-[:HAS_SKILL]->(python),
    (sarah)-[:HAS_SKILL]->(nestjs),
    (sarah)-[:HAS_SKILL]->(aws),
    (sarah)-[:HAS_SKILL]->(docker);

MATCH
    (michael:Developer {id: 'dev_004'}),
    (ts:Skill {id: 'skill_typescript'}),
    (react:Skill {id: 'skill_react'}),
    (node:Skill {id: 'skill_nodejs'})
CREATE
    (michael)-[:HAS_SKILL]->(ts),
    (michael)-[:HAS_SKILL]->(react),
    (michael)-[:HAS_SKILL]->(node);

MATCH
    (react:Technology {id: 'tech_react'}),
    (nextjs:Technology {id: 'tech_nextjs'}),
    (nestjs:Technology {id: 'tech_nestjs'}),
    (fastapi:Technology {id: 'tech_fastapi'}),
    (django:Technology {id: 'tech_django'}),
    (postgresql:Technology {id: 'tech_postgresql'}),
    (redis:Technology {id: 'tech_redis'})
CREATE
    (react)-[:RELATED_TO]->(nextjs),
    (nestjs)-[:RELATED_TO]->(react),
    (fastapi)-[:RELATED_TO]->(django),
    (postgresql)-[:RELATED_TO]->(redis);

MATCH
    (remit:Project {id: 'project_remitcompare'}),
    (react:Technology {id: 'tech_react'}),
    (nestjs:Technology {id: 'tech_nestjs'}),
    (postgresql:Technology {id: 'tech_postgresql'}),
    (redis:Technology {id: 'tech_redis'})
CREATE
    (remit)-[:USES]->(react),
    (remit)-[:USES]->(nestjs),
    (remit)-[:USES]->(postgresql),
    (remit)-[:USES]->(redis);

MATCH
    (study:Project {id: 'project_studyhack'}),
    (nextjs:Technology {id: 'tech_nextjs'}),
    (react:Technology {id: 'tech_react'}),
    (postgresql:Technology {id: 'tech_postgresql'})
CREATE
    (study)-[:USES]->(nextjs),
    (study)-[:USES]->(react),
    (study)-[:USES]->(postgresql);

MATCH
    (alice:Developer {id: 'dev_001'}),
    (remit:Project {id: 'project_remitcompare'}),
    (sarah:Developer {id: 'dev_003'}),
    (maize:Project {id: 'project_maize'}),
    (david:Developer {id: 'dev_002'}),
    (study:Project {id: 'project_studyhack'}),
    (michael:Developer {id: 'dev_004'}),
    (marketplace:Project {id: 'project_marketplace'})
CREATE
    (alice)-[:WORKED_ON]->(remit),
    (sarah)-[:WORKED_ON]->(maize),
    (david)-[:WORKED_ON]->(study),
    (michael)-[:WORKED_ON]->(marketplace);

MATCH
    (paystack:Company {id: 'company_paystack'}),
    (remit:Project {id: 'project_remitcompare'}),
    (flutterwave:Company {id: 'company_flutterwave'}),
    (study:Project {id: 'project_studyhack'}),
    (andela:Company {id: 'company_andela'}),
    (maize:Project {id: 'project_maize'}),
    (techcorp:Company {id: 'company_techcorp'}),
    (marketplace:Project {id: 'project_marketplace'})
CREATE
    (paystack)-[:HAS_PROJECT]->(remit),
    (flutterwave)-[:HAS_PROJECT]->(study),
    (andela)-[:HAS_PROJECT]->(maize),
    (techcorp)-[:HAS_PROJECT]->(marketplace);

MATCH
    (job:Job {id: 'job_backend_001'}),
    (python:Skill {id: 'skill_python'}),
    (postgresql:Skill {id: 'skill_postgresql'}),
    (docker:Skill {id: 'skill_docker'}),
    (nestjs:Skill {id: 'skill_nestjs'})
CREATE
    (job)-[:REQUIRES]->(python),
    (job)-[:REQUIRES]->(postgresql),
    (job)-[:REQUIRES]->(docker),
    (job)-[:REQUIRES]->(nestjs);

MATCH
    (job:Job {id: 'job_fullstack_001'}),
    (typescript:Skill {id: 'skill_typescript'}),
    (react:Skill {id: 'skill_react'}),
    (node:Skill {id: 'skill_nodejs'})
CREATE
    (job)-[:REQUIRES]->(typescript),
    (job)-[:REQUIRES]->(react),
    (job)-[:REQUIRES]->(node);

