aws ecs describe-clusters --cluster avc --output json
{
    "clusters": [
        {
            "clusterArn": "arn:aws:ecs:eu-west-2:486699961018:cluster/avc",
            "clusterName": "avc",
            "status": "ACTIVE",
            "registeredContainerInstancesCount": 1,
            "runningTasksCount": 2,
            "pendingTasksCount": 0,
            "activeServicesCount": 2,
            "statistics": [],
            "tags": [],
            "settings": [
                {
                    "name": "containerInsights",
                    "value": "disabled"
                }
            ],
            "capacityProviders": [],
            "defaultCapacityProviderStrategy": []
        }
    ],
    "failures": []
}


aws ecs list-services --cluster avc
SERVICEARNS     arn:aws:ecs:eu-west-2:486699961018:service/avc-frontend-service
SERVICEARNS     arn:aws:ecs:eu-west-2:486699961018:service/avc-backend-service

aws ecs list-services --cluster avc --output json
{
    "serviceArns": [
        "arn:aws:ecs:eu-west-2:486699961018:service/avc-frontend-service",
        "arn:aws:ecs:eu-west-2:486699961018:service/avc-backend-service"
    ]
}

aws ecs list-tasks --cluster avc --output json
{
    "taskArns": [
        "arn:aws:ecs:eu-west-2:486699961018:task/a3b57bab-c7f5-468a-9158-b816bb3306bf",
        "arn:aws:ecs:eu-west-2:486699961018:task/b8b4aa4e-132d-423b-9f4a-bf5fd0c6aa50"
    ]
}

aws ecs list-task-definitions  --output json
{
    "taskDefinitionArns": [
        "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-backfront:1",
        "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-backfront:2",
        "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-backtask:1",
        "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-backtask:3",
        "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-backtask:4",
        "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-backtask:5",
        "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-backtask:6",
        "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-backtask:7",
        "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-fronttask:1",
        "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-fronttask:2",
        "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-fronttask:3"
    ]
}


aws ecs describe-services --cluster avc --output json --services arn:aws:ecs:eu-west-2:486699961018:service/avc-frontend-service
{
    "services": [
        {
            "serviceArn": "arn:aws:ecs:eu-west-2:486699961018:service/avc-frontend-service",
            "serviceName": "avc-frontend-service",
            "clusterArn": "arn:aws:ecs:eu-west-2:486699961018:cluster/avc",
            "loadBalancers": [],
            "serviceRegistries": [],
            "status": "ACTIVE",
            "desiredCount": 1,
            "runningCount": 1,
            "pendingCount": 0,
            "launchType": "EC2",
            "taskDefinition": "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-fronttask:3",
            "deploymentConfiguration": {
                "maximumPercent": 100,
                "minimumHealthyPercent": 0
            },
            "deployments": [
                {
                    "id": "ecs-svc/9223370460701754056",
                    "status": "PRIMARY",
                    "taskDefinition": "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-fronttask:3",
                    "desiredCount": 1,
                    "pendingCount": 0,
                    "runningCount": 1,
                    "createdAt": 1576153021.751,
                    "updatedAt": 1585904816.238,
                    "launchType": "EC2"
                }
            ],
            "events": [
                {
                    "id": "0ffc38ab-4310-4b96-81a8-2d97dd32c3e2",
                    "createdAt": 1585926438.515,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "7210c1db-4fb5-42cc-b746-3146c33359d2",
                    "createdAt": 1585904816.243,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "4d9cb87c-15ce-4f3b-8cfb-25de49246fdb",
                    "createdAt": 1585904804.601,
                    "message": "(service avc-frontend-service) has started 1 tasks: (task a3b57bab-c7f5-468a-9158-b816bb3306bf)."
                },
                {
                    "id": "a91d7275-4bc8-4e77-a354-e1addf78e50b",
                    "createdAt": 1585884256.027,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "1f64e7b1-68af-49fd-9ea2-54fc064e3a96",
                    "createdAt": 1585862628.287,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "c3accf03-cb9e-43a1-86b0-1e2d0b7be396",
                    "createdAt": 1585841017.252,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "0f5b3cd4-545d-47b6-bfce-4540cd50454e",
                    "createdAt": 1585819411.501,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "e8a7c19c-8100-4382-a713-b4ca118d2b25",
                    "createdAt": 1585797788.919,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "71a6a2e3-83cc-4225-912e-3233a397cd54",
                    "createdAt": 1585776159.86,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "254d14e1-58e0-477b-8e99-73de1454413b",
                    "createdAt": 1585754545.265,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "08347c8a-051a-47d5-ad78-c053cf49c152",
                    "createdAt": 1585732924.91,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "d74b8324-0110-42c3-add3-0e4638c94617",
                    "createdAt": 1585711314.125,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "dc420079-4aeb-4c4b-89de-3bce715e4179",
                    "createdAt": 1585689704.505,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "f83753e6-4087-44b3-b446-5f30ea72deeb",
                    "createdAt": 1585668082.183,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "82895b6b-5952-4de2-b16d-ae88a2e84a62",
                    "createdAt": 1585668082.158,
                    "message": "(daemon service avc-frontend-service) updated desired count to 1."
                },
                {
                    "id": "5803eb45-df6d-49d9-bf18-3737e6eca5b5",
                    "createdAt": 1585668075.851,
                    "message": "(daemon service avc-frontend-service) updated desired count to 2."
                },
                {
                    "id": "7104bd21-d2e0-4ab3-b4b8-37966cc7bd50",
                    "createdAt": 1585666950.092,
                    "message": "(service avc-frontend-service) has started 1 tasks: (task e8173dba-82ce-434b-b6f5-f625110e1838)."
                },
                {
                    "id": "e7059677-f7a5-4468-9d76-38c4d916a355",
                    "createdAt": 1585666950.033,
                    "message": "(daemon service avc-frontend-service) updated desired count to 3."
                },
                {
                    "id": "381b9bb1-a7aa-4d82-96c0-fd546046a57d",
                    "createdAt": 1585666700.505,
                    "message": "(service avc-frontend-service) has started 1 tasks: (task ec1002cf-e5a2-4166-b412-9b71161d5c99)."
                },
                {
                    "id": "a2341a6d-b407-4ba7-8a53-65f6eedf8b45",
                    "createdAt": 1585666565.903,
                    "message": "(service avc-frontend-service) has started 1 tasks: (task 83b3e830-763b-4ae4-901b-fa8b575c4c68)."
                },
                {
                    "id": "415422e1-5d1c-4535-b335-0788bf5dfd5a",
                    "createdAt": 1585666565.849,
                    "message": "(daemon service avc-frontend-service) updated desired count to 2."
                },
                {
                    "id": "b44876d8-5904-4edb-bafa-fee5df6891ec",
                    "createdAt": 1585663968.369,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "20947cea-828b-4b22-8ae7-f27eeb268615",
                    "createdAt": 1585642338.349,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "11ff655f-4812-4fa5-bfab-baf31712db92",
                    "createdAt": 1585620710.898,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "94090349-e7a6-4a23-9437-22458da66e3f",
                    "createdAt": 1585599099.09,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "a1d817e2-36e7-4f2e-9d0a-9108efff353e",
                    "createdAt": 1585577474.039,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "ace9d55a-257c-42c1-8ecc-08689616d941",
                    "createdAt": 1585555871.452,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "1d6df1a3-9c88-4498-8cd6-f6d54ecc5678",
                    "createdAt": 1585534244.582,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "82160873-e56f-470c-95e6-65036e900141",
                    "createdAt": 1585512619.813,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "e65d73bd-1750-42c4-8e34-6cb4175c95cf",
                    "createdAt": 1585491009.995,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "7651c596-2360-4960-a4e1-b7eeb5549e56",
                    "createdAt": 1585469380.602,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "c349c732-f53d-4647-9f91-5db06459d3f3",
                    "createdAt": 1585447758.605,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "f7cba437-fb9d-4197-8c12-3db2037116ad",
                    "createdAt": 1585426158.44,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "85afde8d-8ec4-4f9e-afc8-abd98a272874",
                    "createdAt": 1585404531.814,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "8b5a9996-c946-418b-afac-7f60e5281663",
                    "createdAt": 1585382930.83,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "33b17abc-3387-4c13-87a5-72485b8beafd",
                    "createdAt": 1585361311.219,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "deeadcfe-cddd-4c19-89b6-f2a4109e738f",
                    "createdAt": 1585339689.091,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "0cc97962-8e3f-43df-b8c7-fe512501b827",
                    "createdAt": 1585318067.505,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "5abc45f0-3338-48f2-8b70-f1a39f65f769",
                    "createdAt": 1585296438.685,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "de1aed0b-d644-46ed-bb4f-c38b769f2114",
                    "createdAt": 1585274833.277,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "8e917ba0-0b00-48cf-943a-aae2ee89f9c2",
                    "createdAt": 1585253220.17,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "f2d00cbe-fda0-456c-babf-87019f926c80",
                    "createdAt": 1585231617.406,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "d7015fae-dfaf-4a2b-aa44-301e0fd014d1",
                    "createdAt": 1585210003.271,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "7771d263-ffc7-4f19-9c53-cf7702bdf8cf",
                    "createdAt": 1585188390.553,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "1c0a0663-b220-451a-b28b-1ed7cc5fbd94",
                    "createdAt": 1585166756.728,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "2bd8532f-ac81-4532-b5c6-1d919d097c8a",
                    "createdAt": 1585145152.645,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "21a26c06-4ee5-4230-8106-d76d8827609d",
                    "createdAt": 1585123549.032,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "54b8a155-5ec5-4097-b854-898467d9778d",
                    "createdAt": 1585101931.638,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "cd1cab77-3208-47eb-a75b-30fce71d824e",
                    "createdAt": 1585080329.75,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "f95812f1-4485-40c1-b2c5-73013562d470",
                    "createdAt": 1585058716.213,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "fb4ed263-cda2-44c3-b139-80b91c5142e2",
                    "createdAt": 1585037087.041,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "8b6037cd-6cef-4888-a706-505190d6fe80",
                    "createdAt": 1585015479.455,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "bdeef30a-4604-4283-8518-da0c1768c702",
                    "createdAt": 1584993875.736,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "2c46338d-c992-46a9-a2f9-78aee1d6685b",
                    "createdAt": 1584972258.185,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "e29cbcfd-a1eb-4d48-9c77-24955b145a48",
                    "createdAt": 1584950630.674,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "a71aa942-e4a9-4052-bf64-70b69b51333c",
                    "createdAt": 1584929027.201,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "9127d365-5868-4573-9ab6-68415e5b3a07",
                    "createdAt": 1584907422.649,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "101e9040-a02f-435d-a3ac-3fec4c1efb00",
                    "createdAt": 1584885809.561,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "7b233292-333a-4c2d-a804-b84043cf94f4",
                    "createdAt": 1584864183.012,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "346811cb-eaba-48e7-9cec-c6c13645cb99",
                    "createdAt": 1584842577.26,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "e4dc1556-902f-4716-8a81-4cf2b8cb9219",
                    "createdAt": 1584820975.015,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "f8c43352-b61a-4fd7-bda2-68fc030f1b6a",
                    "createdAt": 1584799358.769,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "9faeb2cd-8bc8-4615-8969-71a0b3da3273",
                    "createdAt": 1584777739.331,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "665e76e4-9bc5-449f-843c-27f962b545f9",
                    "createdAt": 1584756126.074,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "946fbfe0-2946-4a27-9f80-84ad7e2a88a6",
                    "createdAt": 1584734508.976,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "33f9c71f-bf13-4ed1-b5cd-383047ada1eb",
                    "createdAt": 1584712906.928,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "6740dd9f-5e2d-4ee0-b42a-2b35d987612f",
                    "createdAt": 1584691280.443,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "95b8c610-93fc-4301-a1c8-343cdaada5c0",
                    "createdAt": 1584669669.946,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "16e47865-37cc-4264-88ff-a674eb793a56",
                    "createdAt": 1584648063.206,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "a0bcc8ca-876b-4a66-9e25-71f04625cbd3",
                    "createdAt": 1584626435.48,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "27cdd94d-b935-4759-9945-325423a02acf",
                    "createdAt": 1584604809.812,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "aa6ad9cb-3a8b-4d70-9bbe-e2f234523a99",
                    "createdAt": 1584583197.828,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "d6543e3d-5319-4010-a2fb-f82c6817d5ed",
                    "createdAt": 1584561594.284,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "be2abec1-842e-4281-ae0a-d73d3f69e8bc",
                    "createdAt": 1584539982.183,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "423e7031-7224-4cbb-8a68-5a2768708fbe",
                    "createdAt": 1584518378.981,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "bc22f3af-1718-43bd-a824-e1065cbe0369",
                    "createdAt": 1584496748.75,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "677724c5-66e8-4bd6-9686-7cb89e21e11c",
                    "createdAt": 1584475148.326,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "f8ed1f6b-971b-49dc-8bbc-22434464ed46",
                    "createdAt": 1584453544.284,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "e459dd0d-59c2-4b27-a6b5-befb931b5f51",
                    "createdAt": 1584431915.07,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "74b785a8-208e-4d16-82d9-5698a0b4a82b",
                    "createdAt": 1584410301.323,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "501618fc-4f53-437d-8fdc-b4df13c72d15",
                    "createdAt": 1584388695.285,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "12f33751-d934-4ce2-9c2e-38af5a70f1ec",
                    "createdAt": 1584367078.12,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "60b094c9-105b-4562-bbf0-769da3eb2fb2",
                    "createdAt": 1584345457.381,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "46ffc86e-f1eb-46ca-a975-2ebf803ae24d",
                    "createdAt": 1584323839.786,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "86f5c25f-4cca-4dd5-b0bc-b5b78b325e7b",
                    "createdAt": 1584302237.935,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "68045763-2cf7-417a-b62c-aad09b475b93",
                    "createdAt": 1584280636.869,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "aae5c05f-021c-4ed2-ad46-e616b28f56da",
                    "createdAt": 1584259025.922,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "01d718d0-4011-4b29-b043-28f69e04d92d",
                    "createdAt": 1584237417.375,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "00a18bc6-7a86-497e-bcc2-c563a3b0057e",
                    "createdAt": 1584215786.284,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "5b658bdf-3e1d-4d92-a3dd-89667a9fb136",
                    "createdAt": 1584194162.49,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "70889dd5-a423-4278-b82d-0ff72a8cd6c0",
                    "createdAt": 1584172542.25,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "29fc99b4-6e2c-408e-a4a1-56094092464b",
                    "createdAt": 1584150925.059,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "fbe48c36-c37c-4865-938b-7ceb9644f744",
                    "createdAt": 1584129299.075,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "cfea658e-2d84-41ec-a961-e388ed368a8e",
                    "createdAt": 1584107682.61,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "985e4106-b38f-4acc-8e31-83cff6e8d8b9",
                    "createdAt": 1584086058.292,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "93713057-1b91-499b-888b-f648eaa4a338",
                    "createdAt": 1584064457.98,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "59b14dfc-ac01-466a-8825-c34128e31872",
                    "createdAt": 1584042839.065,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "6aaa2892-81d5-464b-8339-00a794229c1b",
                    "createdAt": 1584021226.116,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "5c25484e-adf2-4292-90ac-74fc7bc031d2",
                    "createdAt": 1583999622.312,
                    "message": "(service avc-frontend-service) has reached a steady state."
                },
                {
                    "id": "24c59769-155e-4078-a35a-2406cd6a7e22",
                    "createdAt": 1583977992.28,
                    "message": "(service avc-frontend-service) has reached a steady state."
                }
            ],
            "createdAt": 1576152872.761,
            "placementConstraints": [],
            "placementStrategy": [],
            "schedulingStrategy": "DAEMON",
            "enableECSManagedTags": false,
            "propagateTags": "NONE"
        }
    ],
    "failures": []
}

aws ecs describe-services --cluster avc --output json --services arn:aws:ecs:eu-west-2:486699961018:service/avc-backend-service
{
    "services": [
        {
            "serviceArn": "arn:aws:ecs:eu-west-2:486699961018:service/avc-backend-service",
            "serviceName": "avc-backend-service",
            "clusterArn": "arn:aws:ecs:eu-west-2:486699961018:cluster/avc",
            "loadBalancers": [],
            "serviceRegistries": [],
            "status": "ACTIVE",
            "desiredCount": 1,
            "runningCount": 1,
            "pendingCount": 0,
            "launchType": "EC2",
            "taskDefinition": "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-backtask:7",
            "deploymentConfiguration": {
                "maximumPercent": 100,
                "minimumHealthyPercent": 0
            },
            "deployments": [
                {
                    "id": "ecs-svc/9223370460701935612",
                    "status": "PRIMARY",
                    "taskDefinition": "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-backtask:7",
                    "desiredCount": 1,
                    "pendingCount": 0,
                    "runningCount": 1,
                    "createdAt": 1576152840.168,
                    "updatedAt": 1585904800.913,
                    "launchType": "EC2"
                }
            ],
            "events": [
                {
                    "id": "1193a3cc-e937-4497-a6a2-01fda55e96b3",
                    "createdAt": 1585926429.619,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "eb98c979-3756-4a39-b435-dbd4563ff3bb",
                    "createdAt": 1585904800.918,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "5c9a8c2b-0367-4014-84cf-1b332178bb93",
                    "createdAt": 1585904790.579,
                    "message": "(service avc-backend-service) has started 1 tasks: (task b8b4aa4e-132d-423b-9f4a-bf5fd0c6aa50)."
                },
                {
                    "id": "389a486a-a3e1-4ebe-b957-3807c1465fec",
                    "createdAt": 1585884228.097,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "f7fec82b-71a4-4d7a-a843-99453ed8d6ac",
                    "createdAt": 1585862599.388,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "c502b195-8e13-4ba6-b401-195d536f60ac",
                    "createdAt": 1585840982.008,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "f65410a6-46ce-4e3f-87d1-d406da6e8cb3",
                    "createdAt": 1585819363.641,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "493c28e1-cf36-4bf0-ac5d-f43cef85427b",
                    "createdAt": 1585797763.077,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "2fb32814-05cd-4368-9440-8ea198505681",
                    "createdAt": 1585776142.509,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "630b0d6f-8e6f-4f2a-8833-dd7768978ce9",
                    "createdAt": 1585754525.376,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "f6430cfb-7477-49fc-b7f5-4d6b5b5235ce",
                    "createdAt": 1585732914.462,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "a2044cb4-d6ce-4c6e-a6d7-8c1dda49dd18",
                    "createdAt": 1585711311.409,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "0dbbbe79-3157-45bb-a2d6-565be0fad086",
                    "createdAt": 1585689707.703,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "df2d9cf7-fab8-45a8-8e07-c2d796727319",
                    "createdAt": 1585668085.919,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "eff13481-ccd6-4c3b-8742-5244d49df323",
                    "createdAt": 1585668085.841,
                    "message": "(daemon service avc-backend-service) updated desired count to 1."
                },
                {
                    "id": "4cfc86a1-bf02-4e6e-92fd-deb76c38a31e",
                    "createdAt": 1585668076.421,
                    "message": "(daemon service avc-backend-service) updated desired count to 2."
                },
                {
                    "id": "eba4bc34-de2b-4718-90bf-c96980cb6b6c",
                    "createdAt": 1585666947.028,
                    "message": "(service avc-backend-service) has started 1 tasks: (task 2f8aa648-58a1-49d9-ac8e-f14a2df2f5df)."
                },
                {
                    "id": "271f58c2-2eec-430f-8aeb-686740fec96b",
                    "createdAt": 1585666946.977,
                    "message": "(daemon service avc-backend-service) updated desired count to 3."
                },
                {
                    "id": "16282d43-12e1-4300-b7c6-bf2737e5e3c4",
                    "createdAt": 1585666695.62,
                    "message": "(service avc-backend-service) has started 1 tasks: (task 28c50a2e-717b-41e7-9eef-5a73f0011afb)."
                },
                {
                    "id": "06bfab5b-10f2-4bd5-ae19-e57a5a8d04ee",
                    "createdAt": 1585666570.44,
                    "message": "(service avc-backend-service) has started 1 tasks: (task c07779a6-6d7d-4a70-989e-9d81dfc327ba)."
                },
                {
                    "id": "f4e2073d-8534-4edd-ac95-f865e7d754ae",
                    "createdAt": 1585666570.372,
                    "message": "(daemon service avc-backend-service) updated desired count to 2."
                },
                {
                    "id": "980446ca-1532-4cb8-ba91-899872511355",
                    "createdAt": 1585651013.452,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "f69b375e-aaf6-421c-9d39-a38f9e0d90a9",
                    "createdAt": 1585629382.514,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "6ba26700-9305-408e-ac2e-570a25045e58",
                    "createdAt": 1585607759.247,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "dff57a8c-744b-4b5a-8a65-59f73470df2c",
                    "createdAt": 1585586132.971,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "a94dfbf6-5dfd-4322-9293-eb77925f6888",
                    "createdAt": 1585564529.223,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "48b528dd-6069-4539-b37d-c28099e38c3c",
                    "createdAt": 1585542916.432,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "f0230e28-0fdc-4b52-a39f-9c69c6ebccfc",
                    "createdAt": 1585521286.724,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "c5e26826-dcf6-4919-b5fe-0141d3f02272",
                    "createdAt": 1585499660.945,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "edcb1532-7457-4dbc-bab7-c68a44f4f161",
                    "createdAt": 1585478040.297,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "67ed140c-1227-46a2-adac-2f07c694e20e",
                    "createdAt": 1585456432.07,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "289674da-e4c6-4284-89d0-9eb33f42d0c8",
                    "createdAt": 1585434807.761,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "af4d1395-8e7d-4964-aad9-980928e1ab30",
                    "createdAt": 1585413192.373,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "75f851e3-91c6-4b55-b4f7-ffedb7fd4f3c",
                    "createdAt": 1585391579.315,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "3b04d4d7-b4d5-4372-acb5-5d65570bfdc6",
                    "createdAt": 1585369966.228,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "49fb9c55-d0ea-429b-9619-aac39f15aa04",
                    "createdAt": 1585348343.952,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "ec576950-532e-4a62-bade-66aac0f7940d",
                    "createdAt": 1585326717.143,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "0a231955-50f6-4680-a363-63a3ca5dd779",
                    "createdAt": 1585305113.291,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "de15fcec-9053-46f9-a9d7-614c02dad85d",
                    "createdAt": 1585283491.796,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "335445fc-c99b-4870-a2c9-58d4822dd923",
                    "createdAt": 1585261881.487,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "82123f3d-3b78-4d5e-9728-ef52a36797fd",
                    "createdAt": 1585240249.563,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "7afbdb7b-7b26-4fb9-9d7e-1a17a1ec70f1",
                    "createdAt": 1585218645.311,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "b5823005-d3c4-448c-9dce-f4dc11671667",
                    "createdAt": 1585197039.853,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "45213f65-5b30-454f-9251-1546306a81a6",
                    "createdAt": 1585175423.828,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "c7e3228e-182a-49d4-9ca3-553bcb6e6ee8",
                    "createdAt": 1585153810.379,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "7600d513-6c13-4812-b1b3-0a0ed50534fc",
                    "createdAt": 1585132208.952,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "14dda2fe-f629-4c23-b943-efb1b8270ab9",
                    "createdAt": 1585110578.603,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "1d584885-43d4-402d-ad97-34a348194455",
                    "createdAt": 1585088956.073,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "18a0f14f-45c6-4b61-a6c2-ca7df3df412d",
                    "createdAt": 1585067345.852,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "b2559a7f-71a2-420c-a2c5-c7182345e170",
                    "createdAt": 1585045728.421,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "05de7466-aa99-4e54-aeb3-bd2f27cd180f",
                    "createdAt": 1585024110.056,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "2e583fbd-becd-44cc-9522-14f3f47d0cb0",
                    "createdAt": 1585002483.861,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "5125f09c-25b7-4b72-a31f-ae113ea0862a",
                    "createdAt": 1584980864.79,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "247a1ef9-53f8-4a26-8070-3f24e47f589e",
                    "createdAt": 1584959248.548,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "91e5cdcc-0f52-492b-9149-605fadf8cb90",
                    "createdAt": 1584937619.639,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "eb7c9d0b-8c60-4bf3-a232-acbb767a2e6c",
                    "createdAt": 1584915990.852,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "9edd76e3-d23d-42b6-8aa7-43f5b3d89477",
                    "createdAt": 1584894367.458,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "1e774160-7cb6-4dc9-be6c-fcb0c02cc93e",
                    "createdAt": 1584872749.151,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "fb40cb1f-db94-464f-9e5d-660e9cc70513",
                    "createdAt": 1584851118.478,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "b8c717e4-68a0-431f-8223-075e75b731c8",
                    "createdAt": 1584829504.281,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "954988b6-7e8d-4491-a8af-a6a005b3ed3d",
                    "createdAt": 1584807879.687,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "d107392a-1c79-4622-9cd3-4cf4f8f5d6ef",
                    "createdAt": 1584786258.578,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "2df6bcaa-704a-4b23-ae38-0eb1430e266e",
                    "createdAt": 1584764635.098,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "b50fc689-9965-408c-b9d1-368f272a6ccc",
                    "createdAt": 1584743008.016,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "bda55431-7dc8-47ac-b72d-c784c4624641",
                    "createdAt": 1584721384.412,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "27c401b5-5a14-47df-87ad-dc9eb92c4b69",
                    "createdAt": 1584699766.216,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "0a91b362-74a5-4396-a25c-42808433e932",
                    "createdAt": 1584678164.197,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "9def842b-a7f4-49b0-a1f5-16d6feec98db",
                    "createdAt": 1584656561.783,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "7e6dfb7f-239d-4c29-b502-27ffd6291ca2",
                    "createdAt": 1584634937.642,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "459b9154-b9a5-46f4-9bde-410474933bf7",
                    "createdAt": 1584613314.507,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "69b68db0-b479-42c9-84fd-e71ef9cee1cf",
                    "createdAt": 1584591683.224,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "78c2bb71-8f1c-430b-950a-f8c545b73663",
                    "createdAt": 1584570061.685,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "4825f4a9-9dfe-480d-94b3-77a13708208f",
                    "createdAt": 1584548454.684,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "c79f89aa-0a18-494d-90e9-7332e1df12ab",
                    "createdAt": 1584526823.733,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "6ce27916-2ed6-4025-8db9-8a1d834d80fd",
                    "createdAt": 1584505222.492,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "d0f566b4-21e3-427c-92f9-a2ba8e9f8177",
                    "createdAt": 1584483621.634,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "55d059ed-6c5e-4c55-afc5-6db7327b06a0",
                    "createdAt": 1584461995.122,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "e48ca54f-7099-4181-85f9-1643b0bb79ef",
                    "createdAt": 1584440380.655,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "88287da6-5e61-40d8-b307-8869d823da2f",
                    "createdAt": 1584418763.772,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "c1ceca95-e5a0-40ec-a233-a7bb8dbf0258",
                    "createdAt": 1584397134.462,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "4fe577ee-4925-4ad2-8451-496baf9f6617",
                    "createdAt": 1584375517.812,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "d908b422-d679-46c2-9d6a-420d40855d5b",
                    "createdAt": 1584353891.112,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "bc890ab5-018a-4039-b454-b486b6fd6ef8",
                    "createdAt": 1584332281.3,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "6ed1af03-b317-4359-9777-0b7ac09f35d2",
                    "createdAt": 1584310674.307,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "f1e1eedd-188b-4f4c-877f-33fb758c43fb",
                    "createdAt": 1584289071.84,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "b0ecc6b9-39fa-4ddd-8c3f-88c38bcb41b3",
                    "createdAt": 1584267460.041,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "05eb6c3f-edbf-4581-959a-68ca62e3cddc",
                    "createdAt": 1584245856.301,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "dca5cb4e-0ac5-40a0-bebb-72ee4e26ced3",
                    "createdAt": 1584224251.295,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "10660fef-0ad4-4a53-96c8-3ab29eba7539",
                    "createdAt": 1584202625.541,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "9072c53c-49af-4f9a-be9a-a121bb061a7f",
                    "createdAt": 1584181009.089,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "a465fa88-b85b-41b1-98d1-dd997d7b8f8b",
                    "createdAt": 1584159406.342,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "89879caf-aa85-4bca-8c6f-c44d86732e5c",
                    "createdAt": 1584137800.248,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "1e973ed3-7b96-4825-8205-8aa0f88bbbd6",
                    "createdAt": 1584116178.706,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "d2e4b8b8-b352-42d5-bb3b-c369f12c4f8c",
                    "createdAt": 1584094560.706,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "37dd7d19-125b-42f2-a892-26bde3e012fd",
                    "createdAt": 1584072944.805,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "564e41ea-2981-45de-bda8-c372ac96bcaa",
                    "createdAt": 1584051339.063,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "973f5cd0-b6b0-41c1-ba3f-45718560b52e",
                    "createdAt": 1584029721.771,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "bb72e912-8edc-4423-a35c-ea359e2693f3",
                    "createdAt": 1584008095.001,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "6bd84ff5-54aa-477a-aeb5-814b292cb786",
                    "createdAt": 1583986475.385,
                    "message": "(service avc-backend-service) has reached a steady state."
                },
                {
                    "id": "9a2ee360-b9c6-43d0-bbd3-0624ce779e80",
                    "createdAt": 1583964863.029,
                    "message": "(service avc-backend-service) has reached a steady state."
                }
            ],
            "createdAt": 1576152840.168,
            "placementConstraints": [],
            "placementStrategy": [],
            "schedulingStrategy": "DAEMON",
            "enableECSManagedTags": false,
            "propagateTags": "NONE"
        }
    ],
    "failures": []
}

aws ecs describe-tasks --cluster avc --output json --tasks arn:aws:ecs:eu-west-2:486699961018:task/a3b57bab-c7f5-468a-9158-b816bb3306bf
{
    "tasks": [
        {
            "attachments": [],
            "availabilityZone": "eu-west-2a",
            "clusterArn": "arn:aws:ecs:eu-west-2:486699961018:cluster/avc",
            "connectivity": "CONNECTED",
            "connectivityAt": 1585904804.592,
            "containerInstanceArn": "arn:aws:ecs:eu-west-2:486699961018:container-instance/175ea12a-2ebf-4286-baab-9079cc8d1b8b",
            "containers": [
                {
                    "containerArn": "arn:aws:ecs:eu-west-2:486699961018:container/43d22739-1c83-48c4-8ccb-f884966ed336",
                    "taskArn": "arn:aws:ecs:eu-west-2:486699961018:task/a3b57bab-c7f5-468a-9158-b816bb3306bf",
                    "name": "avc-frontend",
                    "image": "486699961018.dkr.ecr.eu-west-2.amazonaws.com/avc-frontend",
                    "imageDigest": "sha256:9246f2a831f7f699c9793a02dad27f89d203222a34a5891b341d1b145c09697d",
                    "runtimeId": "50f742add50d5af19c68ede0dd64b4cced0f0df553ed863a2620c843e0b80c6a",
                    "lastStatus": "RUNNING",
                    "networkBindings": [
                        {
                            "bindIP": "0.0.0.0",
                            "containerPort": 80,
                            "hostPort": 80,
                            "protocol": "tcp"
                        }
                    ],
                    "networkInterfaces": [],
                    "healthStatus": "UNKNOWN",
                    "cpu": "0",
                    "memory": "64"
                }
            ],
            "cpu": "0",
            "createdAt": 1585904804.592,
            "desiredStatus": "RUNNING",
            "group": "service:avc-frontend-service",
            "healthStatus": "UNKNOWN",
            "lastStatus": "RUNNING",
            "launchType": "EC2",
            "memory": "64",
            "overrides": {
                "containerOverrides": [
                    {
                        "name": "avc-frontend"
                    }
                ],
                "inferenceAcceleratorOverrides": []
            },
            "pullStartedAt": 1585904804.684,
            "pullStoppedAt": 1585904804.684,
            "startedAt": 1585904805.684,
            "startedBy": "ecs-svc/9223370460701754056",
            "tags": [],
            "taskArn": "arn:aws:ecs:eu-west-2:486699961018:task/a3b57bab-c7f5-468a-9158-b816bb3306bf",
            "taskDefinitionArn": "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-fronttask:3",
            "version": 2
        }
    ],
    "failures": []
}

aws ecs describe-tasks --cluster avc --output json --tasks arn:aws:ecs:eu-west-2:486699961018:task/b8b4aa4e-132d-423b-9f4a-bf5fd0c6aa50
{
    "tasks": [
        {
            "attachments": [],
            "availabilityZone": "eu-west-2a",
            "clusterArn": "arn:aws:ecs:eu-west-2:486699961018:cluster/avc",
            "connectivity": "CONNECTED",
            "connectivityAt": 1585904790.567,
            "containerInstanceArn": "arn:aws:ecs:eu-west-2:486699961018:container-instance/175ea12a-2ebf-4286-baab-9079cc8d1b8b",
            "containers": [
                {
                    "containerArn": "arn:aws:ecs:eu-west-2:486699961018:container/9129e60d-d6e9-4e00-a77c-d88138f2b8cb",
                    "taskArn": "arn:aws:ecs:eu-west-2:486699961018:task/b8b4aa4e-132d-423b-9f4a-bf5fd0c6aa50",
                    "name": "avc-backend",
                    "image": "486699961018.dkr.ecr.eu-west-2.amazonaws.com/avc-backend",
                    "imageDigest": "sha256:c68238d232c748659befa094f780f85528984af48eac6b3a4f5a69b01a944a87",
                    "runtimeId": "55aba150235dcf461b96ebd33faa04491eca16855ca46f3ef24c4ed9cf2b9457",
                    "lastStatus": "RUNNING",
                    "networkBindings": [
                        {
                            "bindIP": "0.0.0.0",
                            "containerPort": 4000,
                            "hostPort": 4000,
                            "protocol": "tcp"
                        }
                    ],
                    "networkInterfaces": [],
                    "healthStatus": "UNKNOWN",
                    "cpu": "0",
                    "memory": "128"
                }
            ],
            "cpu": "0",
            "createdAt": 1585904790.567,
            "desiredStatus": "RUNNING",
            "group": "service:avc-backend-service",
            "healthStatus": "UNKNOWN",
            "lastStatus": "RUNNING",
            "launchType": "EC2",
            "memory": "128",
            "overrides": {
                "containerOverrides": [
                    {
                        "name": "avc-backend"
                    }
                ],
                "inferenceAcceleratorOverrides": []
            },
            "pullStartedAt": 1585904791.825,
            "pullStoppedAt": 1585904791.825,
            "startedAt": 1585904791.825,
            "startedBy": "ecs-svc/9223370460701935612",
            "tags": [],
            "taskArn": "arn:aws:ecs:eu-west-2:486699961018:task/b8b4aa4e-132d-423b-9f4a-bf5fd0c6aa50",
            "taskDefinitionArn": "arn:aws:ecs:eu-west-2:486699961018:task-definition/avc-backtask:7",
            "version": 2
        }
    ],
    "failures": []
}


