-- CreateTable
CREATE TABLE "accounts" (
    "acco_id" SERIAL NOT NULL,
    "acco_github_id" INTEGER NOT NULL,
    "acco_github_login" TEXT NOT NULL,
    "acco_github_node_id" TEXT NOT NULL,
    "acco_github_avatar_url" TEXT NOT NULL,
    "acco_github_gravatar_id" TEXT NOT NULL,
    "acco_github_url" TEXT NOT NULL,
    "acco_github_html_url" TEXT NOT NULL,
    "acco_github_followers_url" TEXT NOT NULL,
    "acco_github_following_url" TEXT NOT NULL,
    "acco_github_gists_url" TEXT NOT NULL,
    "acco_github_starred_url" TEXT NOT NULL,
    "acco_github_subscriptions_url" TEXT NOT NULL,
    "acco_github_organizations_url" TEXT NOT NULL,
    "acco_github_repos_url" TEXT NOT NULL,
    "acco_github_events_url" TEXT NOT NULL,
    "acco_github_received_events_url" TEXT NOT NULL,
    "acco_github_type" TEXT NOT NULL,
    "acco_github_site_admin" BOOLEAN NOT NULL,
    "acco_github_name" TEXT NOT NULL,
    "acco_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acco_updated_at" TIMESTAMP(3) NOT NULL,
    "acco_deleted" BOOLEAN NOT NULL DEFAULT false,
    "acco_deleted_at" TIMESTAMP(3),
    "acco_ev_inst_target_id" INTEGER,
    "acco_ev_inst_sender_id" INTEGER,
    "acco_ev_inst_requester_id" INTEGER,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("acco_id")
);

-- CreateTable
CREATE TABLE "events_installations" (
    "ev_inst_id" SERIAL NOT NULL,
    "ev_inst_github_id" INTEGER NOT NULL,
    "ev_inst_github_access_tokens_url" TEXT NOT NULL,
    "ev_inst_github_repository_selection" TEXT NOT NULL,
    "ev_inst_github_repositories_url" TEXT NOT NULL,
    "ev_inst_github_html_url" TEXT NOT NULL,
    "ev_inst_github_target_id" INTEGER NOT NULL,
    "ev_inst_github_target_type" TEXT NOT NULL,
    "ev_inst_github_created_at" TEXT NOT NULL,
    "ev_inst_github_updated_at" TEXT NOT NULL,
    "ev_inst_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ev_inst_updated_at" TIMESTAMP(3) NOT NULL,
    "ev_inst_deleted" BOOLEAN NOT NULL DEFAULT false,
    "ev_inst_deleted_at" TIMESTAMP(3),

    CONSTRAINT "events_installations_pkey" PRIMARY KEY ("ev_inst_id")
);

-- CreateTable
CREATE TABLE "repositories" (
    "repo_id" SERIAL NOT NULL,
    "repo_github_id" INTEGER NOT NULL,
    "repo_github_node_id" TEXT NOT NULL,
    "repo_github_name" TEXT NOT NULL,
    "repo_github_full_name" TEXT NOT NULL,
    "repo_github_private" BOOLEAN NOT NULL,
    "repo_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repo_updated_at" TIMESTAMP(3) NOT NULL,
    "repo_deleted" BOOLEAN NOT NULL DEFAULT false,
    "repo_deleted_at" TIMESTAMP(3),
    "repo_events_installations_id" INTEGER NOT NULL,
    "repo_accounts_id" INTEGER NOT NULL,

    CONSTRAINT "repositories_pkey" PRIMARY KEY ("repo_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_acco_github_id_key" ON "accounts"("acco_github_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_acco_ev_inst_target_id_key" ON "accounts"("acco_ev_inst_target_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_acco_ev_inst_sender_id_key" ON "accounts"("acco_ev_inst_sender_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_acco_ev_inst_requester_id_key" ON "accounts"("acco_ev_inst_requester_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_installations_ev_inst_github_id_key" ON "events_installations"("ev_inst_github_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_installations_ev_inst_github_target_id_key" ON "events_installations"("ev_inst_github_target_id");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_repo_github_id_key" ON "repositories"("repo_github_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_acco_ev_inst_target_id_fkey" FOREIGN KEY ("acco_ev_inst_target_id") REFERENCES "events_installations"("ev_inst_github_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_acco_ev_inst_sender_id_fkey" FOREIGN KEY ("acco_ev_inst_sender_id") REFERENCES "events_installations"("ev_inst_github_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_acco_ev_inst_requester_id_fkey" FOREIGN KEY ("acco_ev_inst_requester_id") REFERENCES "events_installations"("ev_inst_github_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_repo_events_installations_id_fkey" FOREIGN KEY ("repo_events_installations_id") REFERENCES "events_installations"("ev_inst_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_repo_accounts_id_fkey" FOREIGN KEY ("repo_accounts_id") REFERENCES "accounts"("acco_id") ON DELETE RESTRICT ON UPDATE CASCADE;
