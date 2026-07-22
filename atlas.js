/**
 * File overview: Shared Atlas UI scripts — event and agent capability detail panel,
 * event delegation, focus trapping, keyboard shortcuts, and the DAO-detail governance evidence explorer.
 *
 * The mock data below mirrors the shape the backend /atlas/feed and
 * /atlas/proposals/:id endpoints would return.  Every field marked with an
 * @mock comment is placeholder content; fields marked @real have the same
 * name and semantics as the production API.
 */

/* ── Mock event registry ───────────────────────────────────────────── */

/**
 * Each event mirrors (a subset of) the production feedEventFromActivity shape
 * plus enrichment from getProposalDetail / getVoteBreakdown when relevant.
 */
const MOCK_EVENTS = {};

/**
 * Enriched proposal shape — what you'd get from /atlas/proposals/:id +
 * /atlas/proposals/:id/votes.
 */
function proposalEvent(id, overrides) {
  return {
    id,
    /* @real */ daoId: overrides.daoId,
    /* @real */ daoName: overrides.daoName,
    /* @real */ daoCategory: overrides.daoCategory ?? "defi",
    /* @real */ daoLogo: overrides.daoLogo ?? null,
    /* @real */ type: overrides.type ?? "proposal",
    /* @real */ eventType: overrides.eventType ?? "proposal_created",
    /* @real */ eventKind: overrides.eventKind ?? "proposal_created",
    /* @real */ title: overrides.title,
    /* @mock */ description: overrides.description ?? "Detailed description placeholder for Phase 1 static prototype.",
    /* @real */ happenedAt: overrides.happenedAt,
    /* @real */ updatedAt: overrides.updatedAt ?? overrides.happenedAt,
    /* @real */ status: overrides.status,
    /* @real */ coverageState: overrides.coverageState ?? "fresh",
    /* @real */ importanceScore: overrides.importanceScore ?? 75,
    /* @real */ importanceBand: overrides.importanceBand ?? "medium",
    /* @real */ importanceReason: overrides.importanceReason ?? "Active proposal from a tracked DAO.",
    /* @real */ sourceUrl: overrides.sourceUrl ?? null,
    /* @real */ externalId: overrides.externalId ?? null,
    /* @mock */ proposal: overrides.proposal
      ? {
          /* @real */ startAt: overrides.proposal.startAt ?? overrides.happenedAt,
          /* @real */ endAt: overrides.proposal.endAt ?? null,
          /* @real */ quorumRequired: overrides.proposal.quorumRequired ?? null,
          /* @real */ currentQuorum: overrides.proposal.currentQuorum ?? null,
          /* @real */ totalVotes: overrides.proposal.totalVotes ?? null,
          /* @real */ uniqueVoters: overrides.proposal.uniqueVoters ?? null,
          /* @real */ choices: overrides.proposal.choices ?? [],
          /* @real */ voteDistribution: overrides.proposal.voteDistribution ?? null,
          /* @real */ turnout: overrides.proposal.turnout ?? null,
          /* @real */ passingThreshold: overrides.proposal.passingThreshold ?? null,
          /* @mock */ aiSummary: overrides.proposal.aiSummary ?? null,
          /* @real */ author: overrides.proposal.author ?? null,
        }
      : undefined,
    /* @mock */ forum: overrides.forum ?? null,
    /* @mock */ links: overrides.links ?? {},
  };
}

/**
 * Enriched forum thread shape.
 */
function forumEvent(id, overrides) {
  return {
    id,
    /* @real */ daoId: overrides.daoId,
    /* @real */ daoName: overrides.daoName,
    /* @real */ type: "forum",
    /* @real */ eventType: "forum_thread",
    /* @real */ eventKind: "forum_thread",
    /* @real */ title: overrides.title,
    /* @mock */ description: overrides.description ?? "Forum discussion placeholder for Phase 1.",
    /* @real */ happenedAt: overrides.happenedAt,
    /* @real */ status: "discussion",
    /* @real */ coverageState: overrides.coverageState ?? "fresh",
    /* @real */ importanceScore: overrides.importanceScore ?? 50,
    /* @real */ importanceBand: overrides.importanceBand ?? "medium",
    /* @real */ importanceReason: overrides.importanceReason ?? "Active forum discussion.",
    /* @real */ sourceUrl: overrides.sourceUrl ?? null,
    /* @mock */ forum: {
      /* @real */ replyCount: overrides.forum?.replyCount ?? 0,
      /* @real */ participantCount: overrides.forum?.participantCount ?? 0,
      /* @real */ category: overrides.forum?.category ?? "general",
      /* @mock */ excerpt: overrides.forum?.excerpt ?? "Discussion excerpt placeholder.",
      /* @mock */ topReplier: overrides.forum?.topReplier ?? null,
    },
    /* @mock */ links: overrides.links ?? {},
  };
}

function executionEvent(id, overrides) {
  return {
    id,
    /* @real */ daoId: overrides.daoId,
    /* @real */ daoName: overrides.daoName,
    /* @real */ type: "execution",
    /* @real */ eventType: "proposal_executed",
    /* @real */ eventKind: "proposal_executed",
    /* @real */ title: overrides.title,
    /* @mock */ description: overrides.description ?? "Execution detail placeholder.",
    /* @real */ happenedAt: overrides.happenedAt,
    /* @real */ status: "executed",
    /* @real */ coverageState: overrides.coverageState ?? "fresh",
    /* @real */ importanceScore: overrides.importanceScore ?? 60,
    /* @real */ importanceBand: overrides.importanceBand ?? "medium",
    /* @real */ importanceReason: overrides.importanceReason ?? "On-chain execution.",
    /* @real */ sourceUrl: overrides.sourceUrl ?? null,
    /* @mock */ execution: {
      /* @real */ txHash: overrides.execution?.txHash ?? null,
      /* @real */ valueTransferred: overrides.execution?.valueTransferred ?? null,
      /* @real */ targetContract: overrides.execution?.targetContract ?? null,
    },
    /* @mock */ links: overrides.links ?? {},
  };
}

function treasuryEvent(id, overrides) {
  return {
    id,
    /* @real */ daoId: overrides.daoId,
    /* @real */ daoName: overrides.daoName,
    /* @real */ type: "treasury",
    /* @real */ eventType: "treasury_move",
    /* @real */ eventKind: "treasury_move",
    /* @real */ title: overrides.title,
    /* @mock */ description: overrides.description ?? "Treasury movement placeholder.",
    /* @real */ happenedAt: overrides.happenedAt,
    /* @real */ status: "executed",
    /* @real */ coverageState: overrides.coverageState ?? "fresh",
    /* @real */ importanceScore: overrides.importanceScore ?? 40,
    /* @real */ importanceBand: overrides.importanceBand ?? "medium",
    /* @real */ importanceReason: overrides.importanceReason ?? "Treasury movement.",
    /* @real */ sourceUrl: overrides.sourceUrl ?? null,
    /* @mock */ treasury: {
      /* @real */ amount: overrides.treasury?.amount ?? null,
      /* @real */ token: overrides.treasury?.token ?? null,
      /* @real */ from: overrides.treasury?.from ?? null,
      /* @real */ to: overrides.treasury?.to ?? null,
      /* @real */ txHash: overrides.treasury?.txHash ?? null,
    },
    /* @mock */ links: overrides.links ?? {},
  };
}

/* ── Populate mock registry ────────────────────────────────────────── */
(function buildMockRegistry() {
  const registry = {};

  /* ── Feed page bulletin items (governance-feed.html) ── */
  registry["evt-proposal-uniswap-v4"] = proposalEvent("evt-proposal-uniswap-v4", {
    daoId: "uniswap",
    daoName: "Uniswap",
    daoCategory: "dex",
    eventType: "voting_active",
    title: "Uniswap is voting on v4 growth budget renewal — active with 34% turnout so far",
    description:
      "The Uniswap community is deciding whether to renew the v4 protocol growth budget for Q3 2026. " +
      "If passed, the renewal allocates 2.4M UNI toward developer grants, security audits, and ecosystem " +
      "incentives over the next quarter. The current proposal has drawn significant participation from " +
      "major delegates including the Uniswap Foundation and Gauntlet.",
    happenedAt: Date.now() - 2 * 3600 * 1000,
    status: "active",
    importanceScore: 92,
    importanceBand: "high",
    importanceReason: "Active vote from top DeFi DAO with high participation and budget implications.",
    externalId: "QmXyZ...abc123",
    sourceUrl: "https://snapshot.org/#/uniswap/proposal/0xabc123def456",
    proposal: {
      startAt: Date.now() - 12 * 3600 * 1000,
      endAt: Date.now() + 2 * 86400 * 1000,
      quorumRequired: "40M UNI",
      currentQuorum: "34M UNI",
      totalVotes: "2.7M UNI",
      uniqueVoters: 18400,
      choices: [
        { label: "For", votes: "2.4M UNI", percentage: 89 },
        { label: "Against", votes: "0.3M UNI", percentage: 11 },
      ],
      voteDistribution: { for: 89, against: 11, abstain: 0 },
      turnout: 34,
      passingThreshold: "Simple majority (>50%)",
      aiSummary:
        "Uniswap v4 growth budget renewal proposes Q3 2026 allocation of 2.4M UNI for grants, " +
        "audits, and ecosystem incentives. Current turnout is 34% with strong support (89% for). " +
        "The proposal has 2 days remaining in the voting period.",
      author: "0xUniswapFoundation",
    },
    links: {
      detail: "#",
      external: "https://snapshot.org/#/uniswap/proposal/0xabc123def456",
      forum: "https://gov.uniswap.org/t/v4-growth-budget-q3-2026/12345",
    },
  });

  registry["evt-proposal-aave-risk"] = proposalEvent("evt-proposal-aave-risk", {
    daoId: "aave",
    daoName: "Aave",
    daoCategory: "lending",
    eventType: "ending_soon",
    title: "Aave opened a risk parameter update for long-tail markets",
    description:
      "Aave governance has put forward a risk parameter adjustment that recalibrates LTV, liquidation " +
      "thresholds, and supply caps across several long-tail collateral assets. The update is based on " +
      "Chaos Labs' latest risk assessment and targets markets with lower liquidity depth. " +
      "The proposal enters its final voting window with strong delegate engagement.",
    happenedAt: Date.now() - 4 * 3600 * 1000,
    status: "ending-soon",
    importanceScore: 88,
    importanceBand: "high",
    importanceReason: "Risk parameter changes with imminent deadline — high governance impact.",
    externalId: "QmAb...def789",
    sourceUrl: "https://snapshot.org/#/aave/proposal/0xdef789abc",
    proposal: {
      startAt: Date.now() - 4 * 86400 * 1000,
      endAt: Date.now() + 2 * 86400 * 1000,
      quorumRequired: "320k AAVE",
      currentQuorum: "298k AAVE",
      totalVotes: "380k AAVE",
      uniqueVoters: 12900,
      choices: [
        { label: "For", votes: "350k AAVE", percentage: 92 },
        { label: "Against", votes: "30k AAVE", percentage: 8 },
      ],
      voteDistribution: { for: 92, against: 8, abstain: 0 },
      turnout: 41,
      passingThreshold: "Quorum (320k AAVE) + simple majority",
    },
    links: {
      detail: "#",
      external: "https://snapshot.org/#/aave/proposal/0xdef789abc",
      forum: "https://governance.aave.com/t/long-tail-risk-params-q3/12346",
    },
  });

  registry["evt-forum-ens-budget"] = forumEvent("evt-forum-ens-budget", {
    daoId: "ens",
    daoName: "ENS",
    daoCategory: "naming",
    title: "ENS stewards are discussing the service provider budget adjustment — 31 replies",
    description:
      "ENS DAO stewards are debating an adjustment to the service provider budget for the upcoming " +
      "term. The discussion centers on compensation bands for core developers, moderation teams, and " +
      "the new governance tooling working group. Key contributors are weighing in on funding levels and scope.",
    happenedAt: Date.now() - 6 * 3600 * 1000,
    importanceScore: 65,
    importanceBand: "medium",
    sourceUrl: "https://discuss.ens.domains/t/service-provider-budget-adjustment/12347",
    forum: {
      replyCount: 31,
      participantCount: 14,
      category: "governance",
      excerpt:
        "After reviewing the current burn rate and projected needs, I propose we adjust the service provider " +
        "budget by +15% for the core dev team and establish a new working group allocation of 50k USDC/quarter...",
      topReplier: "nick.eth",
    },
    links: {
      detail: "#",
      external: "https://discuss.ens.domains/t/service-provider-budget-adjustment/12347",
    },
  });

  registry["evt-execution-arbitrum-grant"] = executionEvent("evt-execution-arbitrum-grant", {
    daoId: "arbitrum",
    daoName: "Arbitrum",
    daoCategory: "l2",
    title: "Arbitrum executed the DAO grant program third cohort — $2.4M distributed",
    description:
      "The Arbitrum DAO has executed the third cohort of its grant program, distributing $2.4M across 12 " +
      "recipient teams building infrastructure, developer tooling, and ecosystem growth initiatives on Arbitrum. " +
      "This follows the successful on-chain vote that concluded with 94% approval.",
    happenedAt: Date.now() - 8 * 3600 * 1000,
    importanceScore: 78,
    importanceBand: "medium",
    sourceUrl: "https://arbiscan.io/tx/0xabc123grant",
    execution: {
      txHash: "0xabc123def456789grantcohort3",
      valueTransferred: "$2,400,000",
      targetContract: "Arbitrum DAO Grant Disbursement (0xGrant...Disburse)",
    },
    links: {
      detail: "#",
      external: "https://arbiscan.io/tx/0xabc123grant",
    },
  });

  registry["evt-proposal-optimism-retro"] = proposalEvent("evt-proposal-optimism-retro", {
    daoId: "optimism",
    daoName: "Optimism",
    daoCategory: "l2",
    eventType: "proposal_passed",
    title: "Optimism Retro Funding round 6 scope passed — 91% for, 48% turnout",
    description:
      "Optimism's Retroactive Public Goods Funding round 6 has passed with overwhelming support. " +
      "The round will distribute 10M OP tokens to projects that demonstrated measurable impact across " +
      "developer tooling, infrastructure, and end-user education in Q1-Q2 2026.",
    happenedAt: Date.now() - 12 * 3600 * 1000,
    status: "passed",
    importanceScore: 85,
    importanceBand: "high",
    importanceReason: "Major public goods funding round approved with strong turnout.",
    externalId: "QmOP...retro6",
    sourceUrl: "https://snapshot.org/#/optimism/proposal/0xretro6scope",
    proposal: {
      startAt: Date.now() - 5 * 86400 * 1000,
      endAt: Date.now() - 12 * 3600 * 1000,
      totalVotes: "5.2M OP",
      uniqueVoters: 13100,
      choices: [
        { label: "For", votes: "4.73M OP", percentage: 91 },
        { label: "Against", votes: "0.47M OP", percentage: 9 },
      ],
      voteDistribution: { for: 91, against: 9, abstain: 0 },
      turnout: 48,
      passingThreshold: "Quorum + simple majority",
    },
    links: {
      detail: "#",
      external: "https://snapshot.org/#/optimism/proposal/0xretro6scope",
      forum: "https://gov.optimism.io/t/retro-funding-round-6/12348",
    },
  });

  registry["evt-treasury-lido-ldo"] = treasuryEvent("evt-treasury-lido-ldo", {
    daoId: "lido",
    daoName: "Lido",
    daoCategory: "liquid-staking",
    title: "Lido treasury moved 840k LDO to the node operator rewards contract",
    description:
      "Lido DAO's treasury executed a scheduled transfer of 840,000 LDO tokens (~$924k at current price) " +
      "from the main treasury to the node operator rewards contract. This is part of the quarterly reward " +
      "distribution approved under the Lido Node Operator Incentive Program.",
    happenedAt: Date.now() - 18 * 3600 * 1000,
    importanceScore: 55,
    importanceBand: "medium",
    sourceUrl: "https://etherscan.io/tx/0xldotreasury840k",
    treasury: {
      amount: "840,000 LDO",
      token: "LDO",
      from: "Lido Treasury (0xLido...Treasury)",
      to: "Node Operator Rewards (0xNode...Rewards)",
      txHash: "0xldo840ktransfertxhash123",
      usdValue: "$924,000",
    },
    links: {
      detail: "#",
      external: "https://etherscan.io/tx/0xldotreasury840k",
    },
  });

  registry["evt-proposal-maker-dsr"] = proposalEvent("evt-proposal-maker-dsr", {
    daoId: "makerdao",
    daoName: "MakerDAO / Sky",
    daoCategory: "lending",
    eventType: "proposal_executed",
    title: "MakerDAO / Sky DSR rate adjustment for Q3 passed — now active on-chain",
    description:
      "MakerDAO governance has approved and executed the DSR (Dai Savings Rate) adjustment for Q3 2026. " +
      "The rate has been increased from 5.0% to 6.25% APY to align with current market rates and maintain " +
      "DAI demand. The change took effect on-chain following the execution delay period.",
    happenedAt: Date.now() - 24 * 3600 * 1000,
    status: "executed",
    importanceScore: 82,
    importanceBand: "high",
    importanceReason: "Monetary policy change for the largest decentralized stablecoin system.",
    externalId: "QmMKR...dsrq3",
    sourceUrl: "https://vote.makerdao.com/executive/dsr-q3-2026",
    proposal: {
      startAt: Date.now() - 7 * 86400 * 1000,
      endAt: Date.now() - 24 * 3600 * 1000,
      totalVotes: "142k MKR",
      uniqueVoters: 6700,
      choices: [
        { label: "For", votes: "128k MKR", percentage: 90 },
        { label: "Against", votes: "14k MKR", percentage: 10 },
      ],
      voteDistribution: { for: 90, against: 10, abstain: 0 },
      turnout: 22,
      passingThreshold: "Executive vote — continuous approval",
    },
    links: {
      detail: "#",
      external: "https://vote.makerdao.com/executive/dsr-q3-2026",
    },
  });

  registry["evt-proposal-compound-cusdc"] = proposalEvent("evt-proposal-compound-cusdc", {
    daoId: "compound",
    daoName: "Compound",
    daoCategory: "lending",
    eventType: "proposal_defeated",
    title: "Compound cUSDC collateral factor update failed with 62% against",
    description:
      "A proposal to reduce the cUSDC collateral factor from 82% to 77% was defeated. The change was " +
      "proposed by Gauntlet as a risk mitigation measure following increased USDC volatility. However, " +
      "the community voted 62% against, arguing the reduction was premature and would negatively impact " +
      "borrowers without sufficient justification.",
    happenedAt: Date.now() - 2 * 86400 * 1000,
    status: "defeated",
    importanceScore: 70,
    importanceBand: "medium",
    importanceReason: "Risk parameter proposal defeated — notable community rejection of risk measure.",
    externalId: "QmCMP...cusdc",
    sourceUrl: "https://compound.finance/governance/proposals/123",
    proposal: {
      startAt: Date.now() - 5 * 86400 * 1000,
      endAt: Date.now() - 2 * 86400 * 1000,
      totalVotes: "380k COMP",
      uniqueVoters: 4400,
      choices: [
        { label: "Against", votes: "236k COMP", percentage: 62 },
        { label: "For", votes: "144k COMP", percentage: 38 },
      ],
      voteDistribution: { for: 38, against: 62, abstain: 0 },
      turnout: 15,
      passingThreshold: "Quorum (100k COMP) + simple majority",
    },
    links: {
      detail: "#",
      external: "https://compound.finance/governance/proposals/123",
      forum: "https://comp.xyz/t/cusdc-collateral-factor-reduction/12349",
    },
  });

  registry["evt-proposal-gitcoin-gg24"] = proposalEvent("evt-proposal-gitcoin-gg24", {
    daoId: "gitcoin",
    daoName: "Gitcoin",
    daoCategory: "public-goods",
    eventType: "proposal_passed",
    title: "Gitcoin GG24 grant round eligibility criteria passed with 78% support",
    description:
      "The Gitcoin DAO has approved the eligibility criteria for Grants Round 24, which will focus on " +
      "climate solutions, decentralized science, and open-source developer tooling. The criteria include " +
      "updated KYC requirements, multi-round eligibility tracking, and new impact verification standards.",
    happenedAt: Date.now() - 3 * 86400 * 1000,
    status: "passed",
    importanceScore: 72,
    importanceBand: "medium",
    importanceReason: "Major grants program criteria approved — shapes Q3 funding allocation.",
    externalId: "QmGTC...gg24",
    sourceUrl: "https://snapshot.org/#/gitcoin/proposal/0xgg24criteria",
    proposal: {
      startAt: Date.now() - 6 * 86400 * 1000,
      endAt: Date.now() - 3 * 86400 * 1000,
      totalVotes: "2.1M GTC",
      uniqueVoters: 3100,
      choices: [
        { label: "For", votes: "1.64M GTC", percentage: 78 },
        { label: "Against", votes: "0.46M GTC", percentage: 22 },
      ],
      voteDistribution: { for: 78, against: 22, abstain: 0 },
      turnout: 28,
      passingThreshold: "Simple majority",
    },
    links: {
      detail: "#",
      external: "https://snapshot.org/#/gitcoin/proposal/0xgg24criteria",
      forum: "https://gov.gitcoin.co/t/gg24-criteria-proposal/12350",
    },
  });

  registry["evt-forum-balancer-gauge"] = forumEvent("evt-forum-balancer-gauge", {
    daoId: "balancer",
    daoName: "Balancer",
    daoCategory: "dex",
    title: "Balancer is discussing veBAL gauge weight methodology changes — 22 replies",
    description:
      "The Balancer community is actively debating proposed changes to the veBAL gauge weight methodology. " +
      "The discussion centers on whether to adopt a time-weighted allocation model that favors longer-term " +
      "liquidity commitments over the current snapshot-based approach.",
    happenedAt: Date.now() - 5 * 86400 * 1000,
    importanceScore: 58,
    importanceBand: "medium",
    sourceUrl: "https://forum.balancer.fi/t/vebal-gauge-weight-methodology-changes/12351",
    forum: {
      replyCount: 22,
      participantCount: 9,
      category: "governance",
      excerpt:
        "I propose we shift the gauge weight calculation from a weekly snapshot to a 4-week time-weighted " +
        "average. This change would better reward consistent liquidity providers...",
      topReplier: "0xBallers",
    },
    links: {
      detail: "#",
      external: "https://forum.balancer.fi/t/vebal-gauge-weight-methodology-changes/12351",
    },
  });

  /* ── Priority signals (governance-feed.html + index.html) ── */
  registry["evt-priority-aave-risk"] = proposalEvent("evt-priority-aave-risk", {
    daoId: "aave",
    daoName: "Aave",
    daoCategory: "lending",
    eventType: "ending_soon",
    title: "Aave risk update ends in 2 days",
    description:
      "Priority watch: Aave risk parameter update for long-tail markets is ending in 2 days. " +
      "This proposal recalibrates LTV, liquidation thresholds, and supply caps across several assets.",
    happenedAt: Date.now() - 4 * 3600 * 1000,
    status: "ending-soon",
    importanceScore: 88,
    importanceBand: "high",
    importanceReason: "Priority signal — high-impact risk parameter change with tight deadline.",
    sourceUrl: "https://snapshot.org/#/aave/proposal/0xdef789abc",
    proposal: {
      endAt: Date.now() + 2 * 86400 * 1000,
      quorumRequired: "320k AAVE",
      currentQuorum: "298k AAVE",
      totalVotes: "380k AAVE",
      uniqueVoters: 12900,
      choices: [
        { label: "For", votes: "350k AAVE", percentage: 92 },
        { label: "Against", votes: "30k AAVE", percentage: 8 },
      ],
      voteDistribution: { for: 92, against: 8, abstain: 0 },
      turnout: 41,
    },
    links: {
      detail: "#",
      external: "https://snapshot.org/#/aave/proposal/0xdef789abc",
    },
  });

  registry["evt-priority-uniswap-v4"] = proposalEvent("evt-priority-uniswap-v4", {
    daoId: "uniswap",
    daoName: "Uniswap",
    daoCategory: "dex",
    eventType: "voting_active",
    title: "Uniswap v4 growth budget renewal at 34% turnout",
    description:
      "Priority active: Uniswap v4 growth budget renewal is in active voting with 34% turnout. " +
      "89% currently in favor. 2 days remaining.",
    happenedAt: Date.now() - 2 * 3600 * 1000,
    status: "active",
    importanceScore: 92,
    importanceBand: "high",
    importanceReason: "Top DeFi DAO active vote with high budget implications.",
    sourceUrl: "https://snapshot.org/#/uniswap/proposal/0xabc123def456",
    proposal: {
      endAt: Date.now() + 2 * 86400 * 1000,
      totalVotes: "2.7M UNI",
      uniqueVoters: 18400,
      choices: [
        { label: "For", votes: "2.4M UNI", percentage: 89 },
        { label: "Against", votes: "0.3M UNI", percentage: 11 },
      ],
      voteDistribution: { for: 89, against: 11, abstain: 0 },
      turnout: 34,
    },
    links: {
      detail: "#",
      external: "https://snapshot.org/#/uniswap/proposal/0xabc123def456",
    },
  });

  registry["evt-priority-ens-budget"] = forumEvent("evt-priority-ens-budget", {
    daoId: "ens",
    daoName: "ENS",
    daoCategory: "naming",
    title: "ENS service-provider budget debate gaining replies",
    description:
      "Priority forum: ENS steward budget debate is gaining traction with 31 replies and growing participant count.",
    happenedAt: Date.now() - 6 * 3600 * 1000,
    importanceScore: 65,
    importanceBand: "medium",
    sourceUrl: "https://discuss.ens.domains/t/service-provider-budget-adjustment/12347",
    forum: {
      replyCount: 31,
      participantCount: 14,
      category: "governance",
      topReplier: "nick.eth",
    },
    links: {
      detail: "#",
      external: "https://discuss.ens.domains/t/service-provider-budget-adjustment/12347",
    },
  });


  registry["evt-proposal-ens-svc"] = proposalEvent("evt-proposal-ens-svc", {
    daoId: "ens",
    daoName: "ENS",
    daoCategory: "naming",
    eventType: "proposal_passed",
    title: "ENS DAO voted to fund service-provider working group for Q3",
    description:
      "ENS DAO has approved funding for the service-provider working group for Q3 2026. " +
      "The working group will oversee core protocol development, documentation, and community " +
      "management through September 2026 with a budget of 320k USDC.",
    happenedAt: Date.now() - 7 * 86400 * 1000,
    status: "passed",
    importanceScore: 68,
    importanceBand: "medium",
    importanceReason: "Working group funding approved with strong turnout.",
    sourceUrl: "https://snapshot.org/#/ens/proposal/0xenssvcq3",
    proposal: {
      startAt: Date.now() - 9 * 86400 * 1000,
      endAt: Date.now() - 7 * 86400 * 1000,
      totalVotes: "1.8M ENS",
      uniqueVoters: 8200,
      choices: [
        { label: "For", votes: "1.6M ENS", percentage: 89 },
        { label: "Against", votes: "0.2M ENS", percentage: 11 },
      ],
      voteDistribution: { for: 89, against: 11, abstain: 0 },
      turnout: 38,
      passingThreshold: "Quorum + simple majority",
    },
    links: {
      detail: "#",
      external: "https://snapshot.org/#/ens/proposal/0xenssvcq3",
      forum: "https://discuss.ens.domains/t/svc-working-group-q3/12352",
    },
  });

  registry["evt-forum-curve-lend"] = forumEvent("evt-forum-curve-lend", {
    daoId: "curve",
    daoName: "Curve",
    daoCategory: "dex",
    title: "Curve community signals support for new LEND gauge weight framework",
    description:
      "Curve community members are signaling broad support for a proposed LEND gauge weight " +
      "framework that would introduce dynamic weight adjustments based on pool utilization metrics. " +
      "Several prominent Curve delegates have expressed preliminary approval.",
    happenedAt: Date.now() - 8 * 86400 * 1000,
    importanceScore: 52,
    importanceBand: "medium",
    sourceUrl: "https://gov.curve.fi/t/lend-gauge-weight-framework/12353",
    forum: {
      replyCount: 18,
      participantCount: 10,
      category: "governance",
      topReplier: "0xCurveWarrior",
    },
    links: {
      detail: "#",
      external: "https://gov.curve.fi/t/lend-gauge-weight-framework/12353",
    },
  });

  registry["evt-proposal-optimism-grants"] = proposalEvent("evt-proposal-optimism-grants", {
    daoId: "optimism",
    daoName: "Optimism",
    daoCategory: "l2",
    eventType: "proposal_executed",
    title: "Optimism token house approved grants council budget for cycle 19",
    description:
      "The Optimism Token House has approved the Grants Council budget for cycle 19, " +
      "allocating 2.8M OP toward ecosystem grants. The council will prioritize infrastructure, " +
      "developer tooling, and end-user applications through Q4 2026.",
    happenedAt: Date.now() - 9 * 86400 * 1000,
    status: "executed",
    importanceScore: 66,
    importanceBand: "medium",
    importanceReason: "Grants council budget cycle executed.",
    sourceUrl: "https://snapshot.org/#/optimism/proposal/0xgrants19",
    proposal: {
      startAt: Date.now() - 11 * 86400 * 1000,
      endAt: Date.now() - 9 * 86400 * 1000,
      totalVotes: "3.2M OP",
      uniqueVoters: 9800,
      choices: [
        { label: "For", votes: "2.9M OP", percentage: 91 },
        { label: "Against", votes: "0.3M OP", percentage: 9 },
      ],
      voteDistribution: { for: 91, against: 9, abstain: 0 },
      turnout: 32,
      passingThreshold: "Quorum + simple majority",
    },
    links: {
      detail: "#",
      external: "https://snapshot.org/#/optimism/proposal/0xgrants19",
    },
  });

  registry["evt-proposal-aave-cbbtc"] = proposalEvent("evt-proposal-aave-cbbtc", {
    daoId: "aave",
    daoName: "Aave",
    daoCategory: "lending",
    eventType: "proposal_passed",
    title: "Aave proposal to onboard cbBTC as collateral asset passed",
    description:
      "Aave governance has approved the onboarding of Coinbase Wrapped BTC (cbBTC) as a " +
      "collateral asset across multiple Aave v3 markets. The proposal passed with strong " +
      "support, reflecting growing demand for Bitcoin-denominated collateral in DeFi lending.",
    happenedAt: Date.now() - 10 * 86400 * 1000,
    status: "passed",
    importanceScore: 76,
    importanceBand: "high",
    importanceReason: "New collateral asset onboarding — significant market impact.",
    sourceUrl: "https://snapshot.org/#/aave/proposal/0xcbbtconboard",
    proposal: {
      startAt: Date.now() - 12 * 86400 * 1000,
      endAt: Date.now() - 10 * 86400 * 1000,
      totalVotes: "520k AAVE",
      uniqueVoters: 14100,
      choices: [
        { label: "For", votes: "488k AAVE", percentage: 94 },
        { label: "Against", votes: "32k AAVE", percentage: 6 },
      ],
      voteDistribution: { for: 94, against: 6, abstain: 0 },
      turnout: 44,
      passingThreshold: "Quorum (320k AAVE) + simple majority",
    },
    links: {
      detail: "#",
      external: "https://snapshot.org/#/aave/proposal/0xcbbtconboard",
      forum: "https://governance.aave.com/t/onboard-cbbtc/12354",
    },
  });

  registry["cap-research-context"] = {
    id: "cap-research-context",
    type: "agent-skill",
    eventType: "agent_capability",
    title: "Proposal evidence graph",
    description:
      "Atlas packages proposal summaries, forum threads, voter movement, DAO history, freshness metadata, and source links into one research-ready context layer.",
    happenedAt: Date.now(),
    status: "active",
    capability: {
      label: "Research context",
      inputs: "proposal · forum · votes · DAO history",
      outputs: "timeline · evidence links · source freshness",
      workflow:
        "Use this panel as the entry point for DAO research agents that need explainable, citation-backed governance context before drafting memos or comparing proposals.",
    },
    links: {
      external: "https://github.com/ringecosystem/degov-agent-skills/tree/main/skills/dao-governance-research",
      externalLabel: "Open DAO research skill ↗",
    },
  };

  registry["cap-security-review"] = {
    id: "cap-security-review",
    type: "agent-skill",
    eventType: "agent_capability",
    title: "Executable-action risk signals",
    description:
      "Atlas highlights permission changes, treasury movement, contract targets, execution payloads, and high-impact governance signals for proposal-security review.",
    happenedAt: Date.now(),
    status: "active",
    capability: {
      label: "Security review",
      inputs: "execution payload · targets · permissions",
      outputs: "risk signals · contract context · review checklist",
      workflow:
        "Open this when a proposal needs security-oriented triage before voting, execution, or paid agent review.",
    },
    links: {
      external: "https://github.com/ringecosystem/degov-agent-skills/tree/main/skills/dao-governance-security",
      externalLabel: "Open proposal security skill ↗",
    },
  };

  registry["cap-x402-access"] = {
    id: "cap-x402-access",
    type: "agent-skill",
    eventType: "agent_capability",
    title: "Metered paid workflows",
    description:
      "Paid research and proposal-security skills can be gated with x402-compatible payment flow while keeping governance context source-ready for autonomous agents.",
    happenedAt: Date.now(),
    status: "active",
    capability: {
      label: "x402 skill access",
      inputs: "wallet payment · paid endpoint · skill request",
      outputs: "metered access · settled workflow · agent response",
      workflow:
        "Use x402 as the access and settlement layer for premium DAO research or security workflows without turning the module into a marketing banner.",
    },
    links: {
      external: "https://www.x402.org/",
      externalLabel: "Open x402 protocol ↗",
      skillIndex: "https://docs.cdp.coinbase.com/x402/welcome",
      skillIndexLabel: "Read x402 docs ↗",
    },
  };


  /* ── Newsletter issue browser items (newsletters-list.html) ── */
  const newsletterBaseTime = Date.now() - 4 * 3600 * 1000;
  function newsletterLinks(id) {
    return {
      detail: "#",
      external: "https://snapshot.org/#/aave/proposal/" + id,
      externalLabel: "Open source ↗",
      forum: "https://governance.aave.com/t/" + id,
    };
  }
  function newsletterProposal(id, title, description, status, hoursAgo, extra) {
    registry[id] = proposalEvent(id, {
      daoId: "aave",
      daoName: "Aave",
      daoCategory: "lending",
      eventType: "newsletter_issue_item",
      eventKind: "newsletter_issue_item",
      title,
      description,
      happenedAt: newsletterBaseTime - hoursAgo * 3600 * 1000,
      status,
      importanceScore: extra?.score ?? 74,
      importanceBand: extra?.band ?? "medium",
      importanceReason: extra?.reason ?? "Selected for Issue No. 6 because it changes live risk, voting, or execution context.",
      sourceUrl: "https://snapshot.org/#/aave/proposal/" + id,
      proposal: extra?.proposal,
      links: newsletterLinks(id),
    });
  }
  function newsletterForum(id, title, description, hoursAgo, replies) {
    registry[id] = forumEvent(id, {
      daoId: "aave",
      daoName: "Aave",
      title,
      description,
      happenedAt: newsletterBaseTime - hoursAgo * 3600 * 1000,
      importanceScore: 58,
      importanceBand: "medium",
      importanceReason: "Selected for Issue No. 6 as supporting context for active Aave risk decisions.",
      sourceUrl: "https://governance.aave.com/t/" + id,
      forum: {
        replyCount: replies,
        participantCount: Math.max(6, Math.round(replies / 2)),
        category: "risk",
        excerpt: description,
        topReplier: "risk steward",
      },
      links: { external: "https://governance.aave.com/t/" + id, externalLabel: "Open forum ↗" },
    });
  }
  function newsletterExecution(id, title, description, hoursAgo) {
    registry[id] = executionEvent(id, {
      daoId: "aave",
      daoName: "Aave",
      title,
      description,
      happenedAt: newsletterBaseTime - hoursAgo * 3600 * 1000,
      importanceScore: 70,
      importanceBand: "medium",
      importanceReason: "Execution follow-through from an earlier Aave governance decision.",
      execution: { txHash: "0x7a9c5e2f4a1b3d8c9e0f1234567890abcdef1234", targetContract: "Aave Payload Executor" },
      links: { external: "https://etherscan.io/tx/0x7a9c5e2f4a1b3d8c9e0f1234567890abcdef1234", externalLabel: "Open execution ↗" },
    });
  }
  function newsletterTreasury(id, title, description, hoursAgo, status) {
    registry[id] = treasuryEvent(id, {
      daoId: "aave",
      daoName: "Aave",
      title,
      description,
      happenedAt: newsletterBaseTime - hoursAgo * 3600 * 1000,
      status,
      importanceScore: 64,
      importanceBand: "medium",
      importanceReason: "Treasury or budget signal that affects Aave's operational runway.",
      treasury: { amount: "2.1M", token: "GHO", from: "Safety module", to: "service providers" },
      links: newsletterLinks(id),
    });
  }

  newsletterProposal("evt-newsletter-aave-risk-params", "Risk parameter update for long-tail markets", "Risk providers recommend lower caps and tighter collateral settings across thin-liquidity markets. This row opens the same slide-out panel used by live feed events, with source links moved into Quick Links.", "ending-soon", 0, {
    score: 91,
    band: "high",
    reason: "Ending soon and directly changes long-tail collateral risk.",
    proposal: {
      startAt: Date.now() - 4 * 86400000,
      endAt: Date.now() + 2 * 86400000,
      quorumRequired: "320k AAVE",
      currentQuorum: "298k AAVE",
      totalVotes: "380k AAVE",
      uniqueVoters: 12900,
      voteDistribution: { for: 92, against: 8, abstain: 0 },
      turnout: 41,
      passingThreshold: "Quorum + simple majority",
      aiSummary: "Aave's issue-browser item opens a detail panel rather than navigating away. The panel keeps the source and discussion links available while preserving the newsletter reading flow.",
    },
  });
  newsletterForum("evt-newsletter-aave-methodology", "Risk service provider expands LT/LTV methodology notes", "The forum thread explains how liquidation thresholds and LTV recommendations were derived for the active risk update.", 1, 34);
  newsletterProposal("evt-newsletter-aave-reserve-factor", "Freeze reserve factor increase for isolated collateral pools", "Delegates are voting on whether to freeze a proposed reserve-factor increase for isolated pools while liquidity data is reviewed.", "active", 2);
  newsletterProposal("evt-newsletter-aave-oracle-thresholds", "Chaos Labs posts oracle deviation monitoring thresholds", "Risk contributors posted review thresholds for oracle deviation monitoring before additional parameter changes move to vote.", "discussion", 3);
  newsletterTreasury("evt-newsletter-aave-safety-module", "Safety module liquidity budget enters temperature check", "A liquidity budget for the safety module is in temperature check before advancing to a formal vote.", 4, "active");
  newsletterForum("evt-newsletter-aave-delegate-risk-off", "Delegate block summarizes risk-off voting rationale", "A delegate summary explains the conservative voting rationale across the risk-off parameter bundle.", 5, 18);
  newsletterExecution("evt-newsletter-aave-caps-execution", "Previous caps update queued for payload execution review", "The prior cap update has moved into payload review, so readers can inspect execution details without leaving the newsletter.", 6);
  newsletterProposal("evt-newsletter-aave-borrow-cap", "Borrow cap reduction proposed for low-liquidity assets", "Borrow caps are proposed to move lower for assets with shallow liquidity and elevated liquidation risk.", "ending-soon", 7);
  newsletterForum("evt-newsletter-aave-liquidation-bot", "Community asks for liquidation-bot impact analysis", "Community members request additional analysis on how bot concentration may affect liquidations under the new caps.", 8, 27);
  newsletterProposal("evt-newsletter-aave-reserve-exposure", "Stablecoin reserve exposure remains below escalation threshold", "Stablecoin reserve exposure is being watched but remains below the escalation threshold for this issue.", "passed", 9);
  newsletterProposal("evt-newsletter-aave-arfc-sentiment", "ARFC sentiment split narrows after risk provider update", "Snapshot and forum sentiment narrowed after the latest risk-provider update clarified market-specific assumptions.", "active", 10);
  newsletterForum("evt-newsletter-aave-integrator-buffer", "Integrator feedback requests migration timing buffer", "Integrators requested a timing buffer before migration deadlines connected to the risk parameter changes.", 11, 22);
  newsletterProposal("evt-newsletter-aave-stable-debt-cleanup", "Stable debt token cleanup proposal enters delegate review", "A stable debt token cleanup proposal entered delegate review as part of the same maintenance cycle.", "active", 12);
  newsletterForum("evt-newsletter-aave-staged-rollout", "Risk stewards request staged rollout for cap decreases", "Risk stewards are asking for staged cap decreases to reduce operational disruption.", 13, 15);
  newsletterProposal("evt-newsletter-aave-heartbeat-exception", "Price-feed heartbeat exception moves to monitoring queue", "An oracle heartbeat exception moved to monitoring before it can be included in a formal payload.", "discussion", 14);
  newsletterTreasury("evt-newsletter-aave-runway-report", "Service-provider runway report flags next quarter spend", "The service-provider runway report highlights next-quarter spend requirements and review timing.", 15, "passed");
  newsletterForum("evt-newsletter-aave-conservative-path", "Large delegates converge around conservative parameter path", "Large delegates are converging around a conservative parameter path after the risk provider update.", 16, 20);
  newsletterExecution("evt-newsletter-aave-payload-simulation", "Payload simulation confirms no cross-market migration errors", "Payload simulation reports no cross-market migration errors before execution readiness review.", 17);


  /* ── Assign to global ── */
  Object.assign(MOCK_EVENTS, registry);
})();

/* ── Event panel controller ────────────────────────────────────────── */

const EventPanel = (function () {
  let panel = null;
  let backdrop = null;
  let content = null;
  let closeBtn = null;
  let bodyEl = null;
  let triggerElement = null;
  let timelineTriggerElement = null;
  let isOpen = false;
  let previousActiveElement = null;
  let inertRoot = null;
  let proposalListState = null;
  let proposalListScrollTop = 0;

  function init() {
    panel = document.querySelector("#event-detail-panel");
    if (!panel) return;
    const containingShell = panel.closest(".atlas-shell");
    if (containingShell) document.body.appendChild(panel);
    backdrop = panel.querySelector(".event-panel-backdrop");
    content = panel.querySelector(".event-panel-content");
    closeBtn = panel.querySelector(".event-panel-close");
    bodyEl = panel.querySelector(".event-panel-body");
  }

  function open(eventId, triggerEl, options) {
    if (isOpen) close(true);

    options = options || {};
    const eventData = options.eventData || MOCK_EVENTS[eventId];
    if (!eventData) {
      console.warn("EventPanel: no mock data for eventId", eventId);
      return;
    }

    triggerElement = triggerEl;
    previousActiveElement = document.activeElement;

    panel.setAttribute("aria-label", eventData.type === "proposal" || options.proposalRow ? "Proposal detail" : "Governance event detail");
    bodyEl.innerHTML = renderPanelContent(eventData, options);
    panel.dataset.panelMode = options.backToTimeline ? "proposal" : "detail";

    activatePanel();
  }

  function openTimeline(triggerEl) {
    if (isOpen) close(true);

    timelineTriggerElement = triggerEl || timelineTriggerElement;
    triggerElement = triggerEl || timelineTriggerElement;
    previousActiveElement = document.activeElement;

    panel.setAttribute("aria-label", "Proposal timeline");
    bodyEl.innerHTML = renderTimelinePanelContent();
    panel.dataset.panelMode = "timeline";

    activatePanel();
  }

  function openProposalDecision(detail, triggerEl, options) {
    if (isOpen) close(true);
    triggerElement = triggerEl;
    previousActiveElement = document.activeElement;
    panel.setAttribute("aria-label", "Proposal decision: " + (detail?.title || "Proposal"));
    bodyEl.innerHTML = renderProposalDecisionPanel(normalizeProposalDetail(options?.eventData || null, detail), options || {});
    panel.dataset.panelMode = "dao-proposal-decision";
    activatePanel();
  }

  function openProposalCreator(detail, triggerEl) {
    if (isOpen) close(true);
    triggerElement = triggerEl;
    previousActiveElement = document.activeElement;
    panel.setAttribute("aria-label", "Proposal creator: " + (detail?.address || "Creator"));
    bodyEl.innerHTML = renderProposalCreatorPanel(detail || {});
    panel.dataset.panelMode = "dao-proposal-creator";
    activatePanel();
  }

  function openParticipationFrequency(detail, triggerEl) {
    if (isOpen) close(true);
    triggerElement = triggerEl;
    previousActiveElement = document.activeElement;
    panel.setAttribute("aria-label", "Participation frequency: " + (detail?.label || "Cohort"));
    bodyEl.innerHTML = renderParticipationFrequencyPanel(detail || {});
    panel.dataset.panelMode = "dao-participation-frequency";
    activatePanel();
  }

  function openGovernanceSetup(detail, triggerEl) {
    if (isOpen) close(true);
    triggerElement = triggerEl;
    previousActiveElement = document.activeElement;
    panel.setAttribute("aria-label", "Uniswap governance setup");
    bodyEl.innerHTML = renderGovernanceSetupPanel(detail || {});
    panel.dataset.panelMode = "dao-governance-setup";
    activatePanel();
  }

  function openProposalActivityMonth(detail, triggerEl) {
    if (isOpen) close(true);
    proposalListState = detail || {};
    proposalListScrollTop = 0;
    triggerElement = triggerEl;
    previousActiveElement = document.activeElement;
    panel.setAttribute("aria-label", (detail?.title || "Month") + " proposal list");
    bodyEl.innerHTML = renderProposalActivityMonthPanel(proposalListState);
    panel.dataset.panelMode = "dao-proposal-activity-month";
    activatePanel();
  }

  function openProposalParticipation(detail, triggerEl) {
    if (isOpen) close(true);
    triggerElement = triggerEl;
    previousActiveElement = document.activeElement;
    const row = normalizeProposalDetail(null, detail);
    panel.setAttribute("aria-label", "Proposal participation: " + (row?.title || "Proposal"));
    bodyEl.innerHTML = renderProposalParticipationPanel(row || {});
    panel.dataset.panelMode = "dao-proposal-participation";
    activatePanel();
  }

  function openEstablishedVoter(detail, triggerEl) {
    if (isOpen) close(true);
    triggerElement = triggerEl;
    previousActiveElement = document.activeElement;
    panel.setAttribute("aria-label", "Established voter: " + (detail?.voterAddress || "Voter"));
    bodyEl.innerHTML = renderEstablishedVoterPanel(detail || {});
    panel.dataset.panelMode = "dao-established-voter";
    activatePanel();
  }

  function openTypicalPower(detail, triggerEl) {
    if (isOpen) close(true);
    triggerElement = triggerEl;
    previousActiveElement = document.activeElement;
    panel.setAttribute("aria-label", "Typical voting power: " + (detail?.label || "Cohort"));
    bodyEl.innerHTML = renderTypicalPowerPanel(detail || {});
    panel.dataset.panelMode = "dao-typical-power";
    activatePanel();
  }

  function openPowerConcentration(detail, triggerEl) {
    if (isOpen) close(true);
    triggerElement = triggerEl;
    previousActiveElement = document.activeElement;
    panel.setAttribute("aria-label", "Power concentration: Top " + indexedNumber(detail?.selectedCount));
    bodyEl.innerHTML = renderPowerConcentrationPanel(detail || {});
    panel.dataset.panelMode = "dao-power-concentration";
    activatePanel();
  }


  function activatePanel() {
    /* Re-query close button — it's rendered dynamically into #event-panel-body */
    closeBtn = bodyEl.querySelector(".event-panel-close");

    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    panel.removeAttribute("inert");

    inertRoot = document.querySelector(".atlas-shell");
    if (inertRoot) inertRoot.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    document.body.classList.add("is-event-panel-open");
    document.dispatchEvent(new CustomEvent("atlas:panel-open"));
    isOpen = true;

    if (closeBtn) {
      requestAnimationFrame(() => {
        closeBtn.focus();
      });
      closeBtn.addEventListener("click", close);
    }

    bodyEl.querySelectorAll(".agent-copy-chip").forEach((button) => {
      button.addEventListener("click", () => {
        const code = button.closest(".agent-install-box")?.querySelector("code");
        if (!code) return;
        button.textContent = "Copied";
        const writeText = navigator.clipboard?.writeText?.bind(navigator.clipboard);
        if (writeText) writeText(code.innerText).catch(() => {});
        setTimeout(() => {
          button.textContent = "Copy";
        }, 1600);
      });
    });

    initAiAnalysisFlows(bodyEl);

    bodyEl.querySelectorAll("[data-evidence-copy-address]").forEach((button) => {
      button.addEventListener("click", async () => {
        const address = button.dataset.evidenceCopyAddress;
        try {
          await navigator.clipboard.writeText(address);
        } catch (_) {
          const helper = document.createElement("textarea");
          helper.value = address;
          helper.setAttribute("readonly", "");
          helper.style.position = "fixed";
          helper.style.opacity = "0";
          document.body.appendChild(helper);
          helper.select();
          document.execCommand("copy");
          helper.remove();
        }
        button.textContent = "Copied";
        window.setTimeout(() => { button.textContent = "Copy address"; }, 1400);
      });
    });

    bodyEl.querySelectorAll("[data-proposal-list-id]").forEach((button) => {
      button.addEventListener("click", () => showProposalFromList(button.dataset.proposalListId));
    });
    const proposalListBack = bodyEl.querySelector("[data-panel-proposal-list-back]");
    if (proposalListBack) proposalListBack.addEventListener("click", showProposalListAgain);

    bodyEl.querySelectorAll("[data-compact-records-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const expanding = button.getAttribute("aria-expanded") !== "true";
        bodyEl.querySelectorAll("[data-compact-record-extra]").forEach((record) => {
          record.hidden = !expanding;
        });
        button.setAttribute("aria-expanded", String(expanding));
        button.textContent = expanding ? button.dataset.collapseLabel : button.dataset.expandLabel;
      });
    });

    document.addEventListener("keydown", handleKeydown);
    backdrop.addEventListener("click", handleBackdropClick);
    panel.addEventListener("click", handleOverlayClick);
  }

  function close(silent) {
    if (!isOpen) return;
    silent = silent === true;

    document.removeEventListener("keydown", handleKeydown);
    backdrop.removeEventListener("click", handleBackdropClick);
    panel.removeEventListener("click", handleOverlayClick);
    if (closeBtn) closeBtn.removeEventListener("click", close);

    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("inert", "");
    delete panel.dataset.panelMode;

    if (inertRoot) inertRoot.removeAttribute("inert");
    inertRoot = null;
    document.body.style.overflow = "";
    document.body.classList.remove("is-event-panel-open");
    document.dispatchEvent(new CustomEvent("atlas:panel-close"));
    isOpen = false;

    if (!silent && triggerElement) {
      triggerElement.focus({ preventScroll: true });
    }
    if (!silent && previousActiveElement) {
      previousActiveElement.focus({ preventScroll: true });
    }
    triggerElement = null;
    previousActiveElement = null;
  }

  function handleKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "Tab") {
      trapFocus(e);
    }
  }

  function handleBackdropClick(e) {
    if (e.target === backdrop) {
      close();
    }
  }

  function handleOverlayClick(e) {
    if (e.target === panel) close();
  }

  function showProposalFromList(proposalId) {
    const records = Array.isArray(proposalListState?.records) ? proposalListState.records : [];
    const row = records.find((record) => record.id === proposalId);
    if (!row) return;
    const list = bodyEl.querySelector(".dao-month-proposal-list");
    proposalListScrollTop = list ? list.scrollTop : 0;
    bodyEl.innerHTML = renderProposalDecisionPanel(normalizeProposalDetail(null, row), {
      backToProposalList: true,
      proposalListTitle: proposalListState.title,
      contextLabel: compactSectionContext('proposal-activity', 'Proposal Activity'),
    });
    panel.setAttribute("aria-label", "Proposal detail: " + (row.title || "Proposal"));
    panel.dataset.panelMode = "dao-proposal-decision";
    activatePanel();
    bodyEl.scrollTop = 0;
  }

  function showProposalListAgain() {
    if (!proposalListState) return;
    panel.setAttribute("aria-label", (proposalListState.title || "Proposal") + " proposal list");
    bodyEl.innerHTML = renderProposalActivityMonthPanel(proposalListState);
    panel.dataset.panelMode = "dao-proposal-activity-month";
    activatePanel();
    requestAnimationFrame(() => {
      const list = bodyEl.querySelector(".dao-month-proposal-list");
      if (list) list.scrollTop = proposalListScrollTop;
    });
  }

  function trapFocus(e) {
    const focusable = content.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /* ── Content rendering ─────────────────────────────────────────── */

  function renderPanelContent(evt, options) {
    const lines = [];
    options = options || {};
    if (options.proposalRow || evt.type === "proposal") {
      return renderProposalDetailPanel(normalizeProposalDetail(evt, options.proposalRow), options);
    }

    /* Close row */
    lines.push('<div class="event-panel-close-row">');
    if (options.backToTimeline) {
      lines.push(
        '<button class="event-panel-back" type="button" data-panel-timeline-back>← Back to proposals</button>'
      );
    }
    lines.push(
      '<button class="event-panel-close" data-panel-close="" aria-label="Close detail panel">&times;</button>'
    );
    lines.push("</div>");

    /* Meta row: DAO badge + type + time */
    lines.push('<div class="event-panel-meta">');
    if (evt.daoName) {
      lines.push(
        '<span class="event-panel-dao-pill">' + esc(evt.daoName) + "</span>"
      );
    }
    lines.push(
      '<span class="event-panel-meta-text">' +
        esc(formatEventType(evt.type)) +
        " &middot; " +
        esc(formatTime(evt.happenedAt)) +
        "</span>"
    );
    lines.push("</div>");

    /* Status */
    if (evt.status) {
      const statusLabel = formatStatusLabel(evt.status);
      const statusClass = statusToCssClass(evt.status);
      lines.push(
        '<div class="event-panel-status-row"><span class="state-pill ' +
          statusClass +
          '">' +
          esc(statusLabel) +
          "</span></div>"
      );
    }

    /* Title */
    lines.push(
      '<h2 class="event-panel-title">' + esc(evt.title) + "</h2>"
    );

    /* Description */
    if (evt.description && evt.type !== "proposal" && evt.type !== "forum" && evt.type !== "agent-skill") {
      lines.push(
        '<p class="event-panel-description">' + esc(evt.description) + "</p>"
      );
    }

    if (evt.type === "agent-skill" && evt.capability) {
      lines.push(...renderAgentCapabilityPanel(evt));
    } else if (evt.type === "forum") {
      lines.push(...renderSignalPanel(evt));
    }

    /* Execution metrics */
    if (evt.type === "execution" && evt.execution) {
      lines.push('<hr class="event-panel-divider">');
      lines.push('<div class="event-panel-section-label">Execution Details</div>');
      lines.push('<div class="event-panel-metric-grid">');
      const x = evt.execution;
      if (x.valueTransferred)
        lines.push(metricCard("Amount", esc(x.valueTransferred), ""));
      if (x.targetContract)
        lines.push(metricCard("Contract", esc(x.targetContract), ""));
      if (x.txHash)
        lines.push(metricCard("TX", esc(truncateHash(x.txHash)), ""));
      lines.push("</div>");
    }

    /* Treasury metrics */
    if (evt.type === "treasury" && evt.treasury) {
      lines.push('<hr class="event-panel-divider">');
      lines.push('<div class="event-panel-section-label">Treasury Movement</div>');
      lines.push('<div class="event-panel-metric-grid">');
      const t = evt.treasury;
      if (t.amount)
        lines.push(metricCard("Amount", esc(t.amount), t.usdValue ? "~" + esc(t.usdValue) : ""));
      if (t.token)
        lines.push(metricCard("Token", esc(t.token), ""));
      if (t.from)
        lines.push(metricCard("From", esc(truncateHash(t.from)), ""));
      if (t.to)
        lines.push(metricCard("To", esc(truncateHash(t.to)), ""));
      if (t.txHash)
        lines.push(metricCard("TX", esc(truncateHash(t.txHash)), ""));
      lines.push("</div>");
    }

    return lines.join("\n");
  }

  function normalizeProposalDetail(evt, row) {
    if (row) {
      return {
        ...row,
        daoName: row.daoName || evt?.daoName || "Uniswap",
        eventData: evt?.type === "proposal" ? evt : row.eventData || null,
      };
    }
    const proposal = evt?.proposal || {};
    const voteDistribution = proposal.voteDistribution || {};
    const choices = Object.entries(voteDistribution).map(([label, percent]) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      direction: ["for", "against", "abstain"].includes(label) ? label : "other",
      percentOfVotingPower: percent,
      votes: null,
    }));
    const mappedOutcome = evt?.status === "defeated" ? "failed" : ["passed", "executed"].includes(evt?.status) ? "passed" : "unknown";
    return {
      id: evt?.id,
      daoName: evt?.daoName || "DAO",
      title: evt?.title || "Proposal",
      source: "governance feed",
      sourceUrl: evt?.links?.external || evt?.links?.proposal || null,
      discussionUrl: evt?.links?.forum || null,
      lifecycleStatus: evt?.status === "active" ? "active" : "closed",
      outcome: mappedOutcome,
      createdAt: evt?.happenedAt || proposal.startAt,
      startAt: proposal.startAt,
      endAt: proposal.endAt,
      participation: {
        uniqueVoters: proposal.uniqueVoters,
        totalEffectiveBallots: proposal.uniqueVoters,
        totalVotingPower: proposal.totalVotes,
        quorumRequired: proposal.quorumRequired,
        quorumProgressPercent: proposal.quorumProgress,
        quorumReached: proposal.quorumReached,
      },
      choices,
      bodyExcerpt: evt?.description,
      aiSummary: proposal.aiSummary,
      dataAsOf: evt?.happenedAt,
      coverageStatus: null,
      limitations: [],
      eventData: evt,
    };
  }

  function renderProposalDetailPanel(row, options) {
    options = options || {};
    const p = row.participation || {};
    const effectiveBallots = p.totalEffectiveBallots ?? p.effectiveBallots ?? p.totalVotes;
    const quorumProgressPercent = p.quorumProgressPercent ?? (p.quorumProgress == null ? null : Number(p.quorumProgress) * 100);
    const choices = Array.isArray(row.choices) ? row.choices : [];
    const hasEncodedChoicePayloads = choices.some((choice) => /^[{[]/.test(String(choice.label || '').trim()));
    const outcome = row.lifecycleStatus === "active" ? "active" : row.outcome || "unknown";
    const outcomeClass = outcome === "unknown" ? "state-unknown" : outcome === "no_quorum" ? "state-ending-soon" : statusToCssClass(outcome === "failed" ? "defeated" : outcome);
    const lines = ['<article class="proposal-detail-panel" data-proposal-detail-renderer="shared">'];
    lines.push('<div class="event-panel-close-row">');
    if (options.backToProposalList) lines.push('<button class="event-panel-back" type="button" data-panel-proposal-list-back>← Back to ' + esc(options.proposalListTitle || 'proposals') + '</button>');
    if (options.backToTimeline) lines.push('<button class="event-panel-back" type="button" data-panel-timeline-back>← Back to proposals</button>');
    lines.push('<button class="event-panel-close" data-panel-close="" aria-label="Close proposal detail">&times;</button></div>');
    lines.push('<div class="event-panel-meta"><span class="event-panel-dao-pill">' + esc(row.daoName || 'Uniswap') + '</span><span class="event-panel-meta-text">' + esc(row.source || 'governance') + ' · Proposal detail</span></div>');
    lines.push('<div class="event-panel-status-row"><span class="state-pill ' + outcomeClass + '">' + esc(outcome.replace(/_/g, " ")) + '</span></div>');
    lines.push('<h2 class="event-panel-title">' + esc(row.title) + '</h2>');
    const analysisSummary = row.aiSummary || row.bodyExcerpt || 'Atlas is reviewing this proposal against its source text, vote timing, participation, and recent DAO activity.';
    const analysisEvent = row.eventData?.type ? row.eventData : {
      id: row.id,
      daoName: row.daoName || 'Uniswap',
      title: row.title,
      type: 'proposal',
      status: row.lifecycleStatus === 'active' ? 'active' : row.outcome === 'failed' ? 'defeated' : row.outcome === 'passed' ? 'passed' : 'closed',
      happenedAt: row.createdAt || row.startAt || row.endAt,
      description: row.bodyExcerpt || analysisSummary,
      proposal: {
        startAt: row.startAt,
        endAt: row.endAt,
        uniqueVoters: p.uniqueVoters,
        totalVotes: p.totalVotingPower == null ? null : indexedPower(p.totalVotingPower),
        quorumRequired: p.quorumRequired,
        quorumProgress: quorumProgressPercent,
        quorumReached: p.quorumReached,
        aiSummary: analysisSummary,
      },
    };
    lines.push(renderAiAnalysisPanel(analysisEvent, analysisSummary));
    const hasVoteWindow = Boolean(row.createdAt || row.startAt || row.endAt);
    lines.push('<section class="proposal-detail-panel-section"><h3>' + (hasVoteWindow ? 'Vote window' : 'Proposal state') + '</h3><div class="indexed-panel-grid">');
    if (row.createdAt) lines.push(indexedMetric('Created', indexedDate(row.createdAt)));
    if (row.startAt) lines.push(indexedMetric('Start', indexedDate(row.startAt)));
    if (row.endAt) lines.push(indexedMetric('End', indexedDate(row.endAt)));
    lines.push(indexedMetric('Lifecycle', row.lifecycleStatus || 'unknown'));
    lines.push(indexedMetric('Outcome', row.outcome || 'unknown'));
    lines.push('</div></section>');
    if (p.uniqueVoters != null || effectiveBallots != null || p.totalVotingPower != null) {
      lines.push('<section class="proposal-detail-panel-section"><h3>Participation and quorum</h3><div class="indexed-panel-grid">');
      if (p.uniqueVoters != null) lines.push(indexedMetric('Unique voters', indexedNumber(p.uniqueVoters)));
      if (effectiveBallots != null) lines.push(indexedMetric('Effective ballots', indexedNumber(effectiveBallots)));
      if (p.totalVotingPower != null) lines.push(indexedMetric('Total voting power', indexedPower(p.totalVotingPower)));
      if (p.quorumRequired != null) {
        lines.push(indexedMetric('Quorum required', indexedPower(p.quorumRequired)));
        lines.push(indexedMetric('Quorum progress', indexedPercent(quorumProgressPercent)));
        lines.push(indexedMetric('Quorum reached', p.quorumReached ? 'Yes' : 'No'));
      }
      lines.push('</div></section>');
    }
    lines.push('<section class="proposal-detail-panel-section"><h3>Decision distribution</h3>');
    if (!choices.length) {
      const emptyDecisionCopy = effectiveBallots != null && Number(effectiveBallots) === 0 ? 'Zero effective ballots · no decision distribution' : 'Per-choice distribution is not included in this evidence record.';
      lines.push('<div class="decision-empty">' + emptyDecisionCopy + '</div>');
    } else if (hasEncodedChoicePayloads) {
      lines.push('<div class="decision-empty">Per-choice breakdown is unavailable for this weighted ballot.</div>');
      lines.push('<p class="indexed-panel-note">The encoded selection is not presented as a source-native choice label.</p>');
    } else {
      choices.slice(0, 8).forEach((choice) => {
        const direction = ['for','against','abstain'].includes(choice.direction) ? choice.direction : 'other';
        const voteCopy = choice.votes == null ? indexedPercent(choice.percentOfVotingPower) : indexedPercent(choice.percentOfVotingPower) + ' · ' + indexedNumber(choice.votes) + ' votes';
        lines.push('<div class="indexed-panel-choice is-' + direction + '"><strong>' + esc(choice.label) + '</strong><span>' + voteCopy + '</span><div class="indexed-panel-choice-bar"><i style="--choice-width:' + Math.max(0, Math.min(100, Number(choice.percentOfVotingPower) || 0)) + '%"></i></div></div>');
      });
      if (choices.length > 8) lines.push('<p class="indexed-panel-note">Showing 8 of ' + choices.length + ' source-native choices from the proposal record.</p>');
    }
    lines.push('</section>');
    if (row.bodyExcerpt) lines.push('<section class="proposal-detail-panel-section"><h3>Proposal excerpt</h3><div class="indexed-panel-body">' + esc(indexedBodyExcerpt(row.bodyExcerpt)) + '</div></section>');
    lines.push('<section class="proposal-detail-panel-section"><h3>Sources and coverage</h3><div class="indexed-panel-links">');
    if (row.sourceUrl) lines.push('<a href="' + esc(row.sourceUrl) + '" target="_blank" rel="noopener noreferrer">Open proposal ↗</a>');
    if (row.discussionUrl) lines.push('<a href="' + esc(row.discussionUrl) + '" target="_blank" rel="noopener noreferrer">Open discussion ↗</a>');
    lines.push('</div>');
    if (row.coverageStatus || row.dataAsOf) lines.push('<div class="indexed-panel-grid">' + (row.coverageStatus ? indexedMetric('Coverage', row.coverageStatus) : '') + (row.dataAsOf ? indexedMetric('Data as of', indexedDateTime(row.dataAsOf)) : '') + '</div>');
    if (row.coverageStatus && row.participation) lines.push('<p class="indexed-panel-note">Latest effective ballot per proposal and voter. Raw voter lists are not loaded by default.</p>');
    if (row.limitations && row.limitations.length) lines.push('<p class="indexed-panel-note">Limitations: ' + esc(row.limitations.join('; ')) + '</p>');
    lines.push('</section></article>');
    return lines.join('');
  }

  function compactSectionContext(sectionId, fallback) {
    return document.querySelector('#' + sectionId + ' .eyebrow')?.textContent?.trim() || fallback;
  }

  function compactOutcome(row) {
    return row?.lifecycleStatus === 'active' ? 'active' : row?.outcome || 'unknown';
  }

  function compactOutcomeLabel(outcome) {
    if (outcome === 'no_quorum') return 'no quorum';
    if (outcome === 'failed') return 'failed';
    if (outcome === 'passed') return 'passed';
    if (outcome === 'active') return 'active';
    return 'unknown';
  }

  function compactOutcomeClass(outcome) {
    if (outcome === 'no_quorum') return 'state-ending-soon';
    if (outcome === 'failed') return statusToCssClass('defeated');
    if (outcome === 'passed' || outcome === 'active') return statusToCssClass(outcome);
    return 'state-unknown';
  }

  function compactSourceName(value) {
    const source = String(value || 'Snapshot').trim();
    return source ? source.charAt(0).toUpperCase() + source.slice(1) : 'Snapshot';
  }

  function renderCompactCloseRow(options) {
    options = options || {};
    const back = options.backToProposalList
      ? '<button class="event-panel-back" type="button" data-panel-proposal-list-back>← Back to ' + esc(options.proposalListTitle || 'proposals') + '</button>'
      : '';
    return '<div class="event-panel-close-row">' + back + '<button class="event-panel-close" data-panel-close="" aria-label="Close panel">&times;</button></div>';
  }

  function renderCompactMetric(label, value, wide) {
    return '<div' + (wide ? ' class="is-wide"' : '') + '><dt>' + esc(label) + '</dt><dd>' + esc(value == null || value === '' ? 'Unavailable' : value) + '</dd></div>';
  }

  function renderCompactProvenance(detail) {
    const source = detail.source || {};
    const sourceLabel = compactSourceName(source.label || detail.sourceLabel || 'Snapshot');
    const text = [detail.scope, sourceLabel, detail.dataAsOf ? 'data through ' + detail.dataAsOf : null].filter(Boolean).join(' · ');
    const links = [];
    if (detail.sourceUrl) links.push('<a href="' + esc(detail.sourceUrl) + '" target="_blank" rel="noopener noreferrer">Proposal ↗</a>');
    if (detail.discussionUrl) links.push('<a href="' + esc(detail.discussionUrl) + '" target="_blank" rel="noopener noreferrer">Discussion ↗</a>');
    if (Array.isArray(detail.links)) {
      detail.links.forEach((link) => {
        if (link?.url) links.push('<a href="' + esc(link.url) + '" target="_blank" rel="noopener noreferrer">' + esc(link.label || 'Source') + ' ↗</a>');
      });
    }
    if (!detail.sourceUrl && !detail.discussionUrl && !detail.links?.length && source.url) links.push('<a href="' + esc(source.url) + '" target="_blank" rel="noopener noreferrer">Source ↗</a>');
    return '<footer class="dao-compact-provenance">' + (detail.omitText ? '' : '<span>' + esc(text || sourceLabel) + '</span>') + (links.length ? '<nav aria-label="Panel sources">' + links.join('') + '</nav>' : '') + '</footer>';
  }

  function renderProposalDecisionPanel(row, options) {
    options = options || {};
    const participation = row.participation || {};
    const effectiveBallots = participation.totalEffectiveBallots ?? participation.effectiveBallots ?? participation.totalVotes;
    const choices = Array.isArray(row.choices) ? row.choices : [];
    const hasEncodedChoices = choices.some((choice) => /^[{[]/.test(String(choice.label || '').trim()));
    const outcome = compactOutcome(row);
    const dates = [
      ['Created', row.createdAt],
      ['Vote start', row.startAt],
      ['Vote end', row.endAt],
    ].filter((item) => item[1]);
    const metrics = [];
    if (participation.uniqueVoters != null) metrics.push(renderCompactMetric('Unique voters', indexedNumber(participation.uniqueVoters)));
    if (effectiveBallots != null) metrics.push(renderCompactMetric('Effective ballots', indexedNumber(effectiveBallots)));
    const sourceLabel = compactSourceName(row.source || 'Snapshot');
    const aiEvent = {
      type: 'proposal',
      daoName: row.daoName || 'Uniswap',
      title: row.title || 'Proposal',
      status: outcome,
      proposal: {
        uniqueVoters: participation.uniqueVoters,
        totalVotes: effectiveBallots,
        endAt: row.endAt ? Date.parse(row.endAt) : null,
      },
    };
    const lines = ['<article class="dao-compact-panel dao-proposal-decision-panel" data-od-id="proposal-decision-panel">'];
    lines.push(renderCompactCloseRow(options));
    lines.push('<div class="dao-compact-context"><span>' + esc(options.contextLabel || compactSectionContext('proposal-explorer', 'Proposal Explorer')) + '</span><span>' + esc(sourceLabel) + '</span></div>');
    lines.push('<header class="dao-compact-header"><span class="state-pill ' + compactOutcomeClass(outcome) + '">' + esc(compactOutcomeLabel(outcome)) + '</span><h2 class="event-panel-title">' + esc(row.title || 'Proposal') + '</h2></header>');
    lines.push(renderAiAnalysisPanel(aiEvent, row.summary || row.title || 'Proposal evidence summary'));
    if (dates.length) lines.push('<dl class="dao-compact-date-grid">' + dates.map((item) => renderCompactMetric(item[0], indexedDate(item[1]))).join('') + '</dl>');
    if (metrics.length) lines.push('<dl class="dao-compact-metrics">' + metrics.join('') + '</dl>');
    const visibleChoiceCount = Math.min(choices.length, 6);
    lines.push('<section class="dao-compact-section dao-compact-decision"><div class="dao-compact-section-head"><h3>Decision distribution</h3><span>' + (choices.length ? visibleChoiceCount + (visibleChoiceCount === 1 ? ' choice' : ' choices') : 'Source record') + '</span></div>');
    if (!choices.length) {
      const emptyCopy = effectiveBallots != null && Number(effectiveBallots) === 0
        ? 'Zero effective ballots; no decision distribution.'
        : 'Per-choice distribution is not included in this proposal record.';
      lines.push('<p class="dao-compact-empty">' + esc(emptyCopy) + '</p>');
    } else if (hasEncodedChoices) {
      lines.push('<p class="dao-compact-empty">Weighted ballot breakdown is unavailable; encoded selections are not presented as source-native choices.</p>');
    } else {
      choices.slice(0, 6).forEach((choice) => {
        const direction = ['for', 'against', 'abstain'].includes(choice.direction) ? choice.direction : 'other';
        const percent = Math.max(0, Math.min(100, Number(choice.percentOfVotingPower) || 0));
        const count = choice.votes ?? choice.effectiveBallots;
        const value = indexedPercent(choice.percentOfVotingPower) + (count == null ? '' : ' · ' + indexedNumber(count) + ' ballots');
        lines.push('<div class="dao-compact-choice is-' + direction + '"><div><strong>' + esc(choice.label || 'Choice') + '</strong><span>' + esc(value) + '</span></div><i><b style="--choice-width:' + percent + '%"></b></i></div>');
      });
      if (choices.length > 6) lines.push('<p class="dao-compact-note">Showing 6 of ' + choices.length + ' source-native choices.</p>');
    }
    lines.push('</section>');
    lines.push(renderCompactProvenance({
      sourceLabel,
      sourceUrl: row.sourceUrl,
      discussionUrl: row.discussionUrl,
      dataAsOf: row.dataAsOf ? indexedDateTime(row.dataAsOf) : null,
      scope: 'Indexed proposal evidence',
    }));
    lines.push('</article>');
    return lines.join('');
  }

  function renderProposalCreatorPanel(detail) {
    const records = Array.isArray(detail.proposalHistory) ? detail.proposalHistory : [];
    const initialLimit = Math.min(6, records.length);
    const outcomeOrder = ['passed', 'failed', 'no_quorum', 'unknown'];
    const outcomeSummary = outcomeOrder
      .filter((key) => Number(detail.outcomes?.[key] || 0) > 0)
      .map((key) => indexedNumber(detail.outcomes[key]) + ' ' + compactOutcomeLabel(key))
      .join(' · ');
    const lines = ['<article class="dao-compact-panel dao-proposal-creator-panel" data-od-id="proposal-creator-panel">'];
    lines.push(renderCompactCloseRow());
    lines.push('<div class="dao-compact-context"><span>' + esc(detail.contextLabel || compactSectionContext('proposal-creators', 'Proposal Creators')) + '</span><span>Snapshot</span></div>');
    lines.push('<header class="dao-compact-header"><h2 class="event-panel-title">Creator profile</h2></header>');
    lines.push('<div class="dao-compact-identity"><code>' + esc(detail.address || 'Unavailable') + '</code><button type="button" data-evidence-copy-address="' + esc(detail.address || '') + '">Copy</button></div>');
    lines.push('<dl class="dao-compact-metrics dao-creator-metrics">' +
      renderCompactMetric('Indexed proposals', indexedNumber(detail.indexedProposalCount)) +
      renderCompactMetric('Share of indexed', indexedPercent(detail.shareOfIndexedProposalsPercent)) +
      renderCompactMetric('Latest proposal', indexedDate(detail.latestCreatedAt)) +
      '</dl>');
    if (outcomeSummary) lines.push('<div class="dao-compact-outcome-line"><span>Outcome mix</span><strong>' + esc(outcomeSummary) + '</strong></div>');
    lines.push('<section class="dao-compact-section"><div class="dao-compact-section-head"><h3>Recent proposals</h3><span>' + initialLimit + ' of ' + records.length + '</span></div><ol class="dao-compact-record-list">');
    records.forEach((record, index) => {
      const outcome = compactOutcome(record);
      const hidden = index >= initialLimit ? ' hidden data-compact-record-extra' : '';
      const tag = record.sourceUrl ? 'a' : 'div';
      const link = record.sourceUrl ? ' href="' + esc(record.sourceUrl) + '" target="_blank" rel="noopener noreferrer"' : '';
      lines.push('<li' + hidden + '><' + tag + ' class="dao-compact-proposal-record" title="' + esc(record.title || 'Proposal') + '"' + link + '><time>' + esc(indexedDate(record.createdAt)) + '</time><span class="state-pill ' + compactOutcomeClass(outcome) + '">' + esc(compactOutcomeLabel(outcome)) + '</span><strong>' + esc(record.title || 'Proposal') + '</strong><span aria-hidden="true">' + (record.sourceUrl ? '↗' : '') + '</span></' + tag + '></li>');
    });
    lines.push('</ol>');
    const extraCount = records.length - initialLimit;
    if (extraCount > 0) lines.push('<button class="dao-compact-records-toggle" type="button" data-compact-records-toggle data-expand-label="Show ' + extraCount + ' more" data-collapse-label="Show recent ' + initialLimit + '" aria-expanded="false">Show ' + extraCount + ' more</button>');
    lines.push('</section>');
    lines.push('</article>');
    return lines.join('');
  }

  function renderParticipationFrequencyPanel(detail) {
    const records = Array.isArray(detail.sampleVoters) ? detail.sampleVoters.slice(0, 5) : [];
    const definition = detail.max == null
      ? indexedNumber(detail.min) + '+ indexed proposals'
      : detail.min === detail.max
        ? indexedNumber(detail.min) + ' indexed proposal' + (Number(detail.min) === 1 ? '' : 's')
        : indexedNumber(detail.min) + '–' + indexedNumber(detail.max) + ' indexed proposals';
    const lines = ['<article class="dao-compact-panel dao-participation-frequency-panel" data-od-id="participation-frequency-panel">'];
    lines.push(renderCompactCloseRow());
    lines.push('<div class="dao-compact-context"><span>' + esc(detail.contextLabel || compactSectionContext('voting-depth', '07 · Participation Frequency')) + '</span><span>Voter cohort</span></div>');
    lines.push('<header class="dao-compact-header"><h2 class="event-panel-title">' + esc((detail.label || 'Participation') + ' cohort') + '</h2></header>');
    lines.push('<dl class="dao-compact-metrics dao-frequency-metrics">' +
      renderCompactMetric('Addresses', indexedNumber(detail.voterCount)) +
      renderCompactMetric('Address share', indexedPercent(detail.share)) +
      '</dl>');
    lines.push('<section class="dao-compact-section"><div class="dao-compact-section-head"><h3>Sample addresses</h3><span>' + records.length + ' shown</span></div><ol class="dao-compact-record-list">');
    records.forEach((record) => {
      lines.push('<li><div class="dao-compact-voter-record"><code title="' + esc(record.voterAddress || record.voterId || '') + '">' + esc(truncateHash(record.voterAddress || record.voterId || 'Unavailable')) + '</code><strong>' + esc(indexedNumber(record.proposalsVoted) + ' proposal' + (Number(record.proposalsVoted) === 1 ? '' : 's')) + '</strong><time>' + esc(indexedDate(record.lastVotedAt)) + '</time></div></li>');
    });
    lines.push('</ol></section>');
    lines.push('</article>');
    return lines.join('');
  }

  function renderGovernanceSetupPanel(detail) {
    const space = detail.space || {};
    const phases = Array.isArray(detail.phases) ? detail.phases.slice(0, 3) : [];
    const lines = ['<article class="dao-compact-panel dao-governance-setup-panel" data-od-id="governance-setup-panel">'];
    lines.push(renderCompactCloseRow());
    lines.push('<div class="dao-compact-context"><span>' + esc(detail.contextLabel || '01 · Overview') + '</span><span>Process & settings</span></div>');
    lines.push('<header class="dao-compact-header"><h2 class="event-panel-title">' + esc(detail.label || 'Governance setup') + '</h2></header>');
    lines.push('<dl class="dao-compact-metrics dao-governance-metrics">' +
      renderCompactMetric('Voting power', space.votingPower, true) +
      renderCompactMetric('Network', space.network) +
      renderCompactMetric('Default period', space.defaultVotingPeriod) +
      renderCompactMetric('Default quorum', space.defaultQuorum, true) +
      '</dl>');
    if (space.ballotType) lines.push('<div class="dao-compact-outcome-line"><span>Ballot type</span><strong>' + esc(space.ballotType) + '</strong></div>');
    lines.push('<section class="dao-compact-section"><div class="dao-compact-section-head"><h3>Governance path</h3><span>' + phases.length + ' stages</span></div><ol class="dao-compact-path">');
    phases.forEach((phase, index) => {
      lines.push('<li><span>' + String(index + 1).padStart(2, '0') + '</span><div><strong>' + esc(phase.name || phase.shortName || 'Stage') + '</strong><small>' + esc([phase.location, phase.duration].filter(Boolean).join(' · ')) + '</small></div></li>');
    });
    lines.push('</ol></section>');
    lines.push('</article>');
    return lines.join('');
  }

  function renderProposalActivityMonthPanel(detail) {
    const records = Array.isArray(detail.records) ? detail.records : [];
    const lines = ['<article class="dao-compact-panel dao-proposal-activity-panel" data-od-id="proposal-activity-month-panel">'];
    lines.push(renderCompactCloseRow());
    lines.push('<div class="dao-compact-context"><span>' + esc(detail.contextLabel || compactSectionContext('proposal-activity', '03 · Proposal Activity')) + '</span><span>UTC month</span></div>');
    lines.push('<header class="dao-compact-header"><h2 class="event-panel-title">' + esc(detail.title || 'Month proposals') + '</h2></header>');
    lines.push('<dl class="dao-compact-metrics dao-month-metrics">' +
      renderCompactMetric('Indexed proposals', indexedNumber(detail.proposalCount ?? records.length)) +
      renderCompactMetric('Time basis', 'Source-created UTC') +
      '</dl>');
    lines.push('<section class="dao-compact-section"><div class="dao-compact-section-head"><h3>Proposal records</h3><span>' + records.length + ' shown</span></div><ol class="dao-compact-record-list dao-month-proposal-list" aria-label="' + esc(detail.title || 'Month proposals') + '">');
    records.forEach((record) => {
      const outcome = compactOutcome(record);
      lines.push('<li><button class="dao-compact-month-record" type="button" data-proposal-list-id="' + esc(record.id) + '" title="' + esc(record.title || 'Proposal') + '"><time>' + esc(indexedDate(record.createdAt)) + '</time><span class="state-pill ' + compactOutcomeClass(outcome) + '">' + esc(compactOutcomeLabel(outcome)) + '</span><strong>' + esc(record.title || 'Proposal') + '</strong><span aria-hidden="true">→</span></button></li>');
    });
    lines.push('</ol></section>');
    lines.push('</article>');
    return lines.join('');
  }

  function renderCompactChoiceEvidence(row, heading) {
    const participation = row.participation || {};
    const effectiveBallots = participation.totalEffectiveBallots ?? participation.effectiveBallots ?? participation.totalVotes;
    const choices = Array.isArray(row.choices) ? row.choices : [];
    const hasEncodedChoices = choices.some((choice) => /^[{[]/.test(String(choice.label || '').trim()));
    const visibleChoiceCount = Math.min(choices.length, 6);
    const lines = ['<section class="dao-compact-section dao-compact-decision"><div class="dao-compact-section-head"><h3>' + esc(heading || 'Choice distribution') + '</h3><span>' + (choices.length ? visibleChoiceCount + (visibleChoiceCount === 1 ? ' choice' : ' choices') : 'Source record') + '</span></div>'];
    if (!choices.length) {
      lines.push('<p class="dao-compact-empty">' + esc(effectiveBallots != null && Number(effectiveBallots) === 0 ? 'Zero effective ballots; no choice distribution.' : 'Per-choice distribution is not included in this proposal record.') + '</p>');
    } else if (hasEncodedChoices) {
      lines.push('<p class="dao-compact-empty">Weighted ballot breakdown is unavailable; encoded selections are not presented as source-native choices.</p>');
    } else {
      choices.slice(0, 6).forEach((choice) => {
        const direction = ['for', 'against', 'abstain'].includes(choice.direction) ? choice.direction : 'other';
        const percent = Math.max(0, Math.min(100, Number(choice.percentOfVotingPower) || 0));
        const count = choice.votes ?? choice.effectiveBallots;
        const value = indexedPercent(choice.percentOfVotingPower) + (count == null ? '' : ' · ' + indexedNumber(count) + ' ballots');
        lines.push('<div class="dao-compact-choice is-' + direction + '"><div><strong>' + esc(choice.label || 'Choice') + '</strong><span>' + esc(value) + '</span></div><i><b style="--choice-width:' + percent + '%"></b></i></div>');
      });
      if (choices.length > 6) lines.push('<p class="dao-compact-note">Showing 6 of ' + choices.length + ' source-native choices.</p>');
    }
    lines.push('</section>');
    return lines.join('');
  }

  function renderProposalParticipationPanel(row) {
    const participation = row.participation || {};
    const effectiveBallots = participation.totalEffectiveBallots ?? participation.effectiveBallots ?? participation.totalVotes;
    const quorumProgress = participation.quorumProgressPercent ?? (participation.quorumProgress == null ? null : Number(participation.quorumProgress) * 100);
    const metrics = [];
    if (participation.uniqueVoters != null) metrics.push(renderCompactMetric('Unique voters', indexedNumber(participation.uniqueVoters)));
    if (effectiveBallots != null) metrics.push(renderCompactMetric('Effective ballots', indexedNumber(effectiveBallots)));
    if (participation.totalVotingPower != null) metrics.push(renderCompactMetric('Observed voting power', indexedPower(participation.totalVotingPower) + ' Snapshot VP'));
    if (quorumProgress != null) metrics.push(renderCompactMetric('Quorum progress', indexedPercent(quorumProgress)));
    const outcome = compactOutcome(row);
    const sourceLabel = compactSourceName(row.source || 'Snapshot');
    const lines = ['<article class="dao-compact-panel dao-proposal-participation-panel" data-od-id="proposal-participation-panel">'];
    lines.push(renderCompactCloseRow());
    lines.push('<div class="dao-compact-context"><span>' + esc(compactSectionContext('proposal-timeline', '05 · Participation by Proposal')) + '</span><span>' + esc(sourceLabel) + '</span></div>');
    lines.push('<header class="dao-compact-header"><span class="state-pill ' + compactOutcomeClass(outcome) + '">' + esc(compactOutcomeLabel(outcome)) + '</span><h2 class="event-panel-title">' + esc(row.title || 'Proposal') + '</h2></header>');
    if (metrics.length) lines.push('<dl class="dao-compact-metrics dao-participation-metrics">' + metrics.join('') + '</dl>');
    if (participation.quorumRequired != null) lines.push('<div class="dao-compact-outcome-line"><span>Recorded quorum</span><strong>' + esc(indexedPower(participation.quorumRequired) + ' Snapshot VP · ' + (participation.quorumReached ? 'reached' : 'not reached')) + '</strong></div>');
    lines.push(renderCompactChoiceEvidence(row, 'Choice distribution'));
    if (participation.totalVotingPower != null) lines.push('<p class="dao-compact-caution">Observed cast VP is proposal voting evidence, not current holdings or delegation.</p>');
    lines.push(renderCompactProvenance({ sourceLabel, sourceUrl: row.sourceUrl, discussionUrl: row.discussionUrl, dataAsOf: row.dataAsOf ? indexedDateTime(row.dataAsOf) : null, scope: 'Latest-effective proposal participation' }));
    lines.push('</article>');
    return lines.join('');
  }

  function renderEstablishedVoterPanel(detail) {
    const records = Array.isArray(detail.voteHistory) ? detail.voteHistory.slice(0, 6) : [];
    const directionSummary = ['for', 'against', 'abstain', 'other']
      .filter((key) => Number(detail.choicesByDirection?.[key] || 0) > 0)
      .map((key) => indexedNumber(detail.choicesByDirection[key]) + ' ' + key)
      .join(' · ');
    const lines = ['<article class="dao-compact-panel dao-established-voter-panel" data-od-id="established-voter-panel">'];
    lines.push(renderCompactCloseRow());
    lines.push('<div class="dao-compact-context"><span>' + esc(detail.contextLabel || compactSectionContext('top-voters', '06 · Established Voters')) + '</span><span>Voter profile</span></div>');
    lines.push('<header class="dao-compact-header"><h2 class="event-panel-title">Established voter</h2></header>');
    lines.push('<div class="dao-compact-identity"><code>' + esc(detail.voterAddress || 'Unavailable') + '</code><button type="button" data-evidence-copy-address="' + esc(detail.voterAddress || '') + '">Copy</button></div>');
    lines.push('<dl class="dao-compact-metrics dao-voter-metrics">' +
      renderCompactMetric('Proposals voted', indexedNumber(detail.proposalsVoted) + ' / ' + indexedNumber(detail.analyzedProposalCount)) +
      renderCompactMetric('Coverage', indexedPercent(detail.coveragePercent)) +
      renderCompactMetric('Average observed VP', indexedPower(detail.averageVotingPowerPerProposal) + ' Snapshot VP', true) +
      renderCompactMetric('Voting window', indexedDate(detail.firstVotedAt) + ' → ' + indexedDate(detail.lastVotedAt), true) +
      '</dl>');
    if (directionSummary) lines.push('<div class="dao-compact-outcome-line"><span>Choice mix</span><strong>' + esc(directionSummary) + '</strong></div>');
    lines.push('<section class="dao-compact-section"><div class="dao-compact-section-head"><h3>Recent votes</h3><span>' + records.length + ' of ' + indexedNumber(detail.voteHistoryCount) + '</span></div><ol class="dao-compact-record-list">');
    records.forEach((record) => {
      const direction = ['for', 'against', 'abstain'].includes(record.choiceDirection) ? record.choiceDirection : 'other';
      const rawChoice = String(record.choiceLabel || 'Choice');
      const choice = /^[{[]/.test(rawChoice.trim()) ? 'Weighted ballot' : rawChoice;
      lines.push('<li><a class="dao-compact-vote-record" href="' + esc(record.sourceUrl || '#') + '" target="_blank" rel="noopener noreferrer" title="' + esc(record.proposalTitle || 'Proposal') + '"><time>' + esc(indexedDate(record.votedAt)) + '</time><span class="dao-compact-choice-tag is-' + direction + '">' + esc(choice) + '</span><strong>' + esc(record.proposalTitle || 'Proposal') + '</strong><span aria-hidden="true">↗</span></a></li>');
    });
    lines.push('</ol></section>');
    lines.push('</article>');
    return lines.join('');
  }

  function renderTypicalPowerPanel(detail) {
    const records = Array.isArray(detail.sampleVoters) ? detail.sampleVoters.slice(0, 5) : [];
    const lines = ['<article class="dao-compact-panel dao-typical-power-panel" data-od-id="typical-power-panel">'];
    lines.push(renderCompactCloseRow());
    lines.push('<div class="dao-compact-context"><span>' + esc(detail.contextLabel || compactSectionContext('power-distribution', '08 · Typical Voting Power')) + '</span><span>Power cohort</span></div>');
    lines.push('<header class="dao-compact-header"><h2 class="event-panel-title">' + esc((detail.label || 'Power') + ' VP cohort') + '</h2></header>');
    lines.push('<dl class="dao-compact-metrics dao-power-metrics">' +
      renderCompactMetric('Addresses', indexedNumber(detail.voterCount)) +
      renderCompactMetric('Address share', indexedPercent(detail.voterSharePercent)) +
      '</dl>');
    lines.push('<section class="dao-compact-section"><div class="dao-compact-section-head"><h3>Sample addresses</h3><span>' + records.length + ' shown</span></div><ol class="dao-compact-record-list">');
    records.forEach((record) => {
      lines.push('<li><div class="dao-compact-power-record"><code title="' + esc(record.voterAddress || record.voterId || '') + '">' + esc(truncateHash(record.voterAddress || record.voterId || 'Unavailable')) + '</code><strong>' + esc(indexedPower(record.averageVotingPowerPerProposal) + ' VP') + '</strong><span>' + esc(indexedNumber(record.proposalsVoted) + ' proposals') + '</span></div></li>');
    });
    lines.push('</ol></section>');
    lines.push('</article>');
    return lines.join('');
  }

  function renderPowerConcentrationPanel(detail) {
    const count = Number(detail.selectedCount || 0);
    const records = Array.isArray(detail.topVoters) ? detail.topVoters.slice(0, Math.min(count, 5)) : [];
    const lines = ['<article class="dao-compact-panel dao-power-concentration-panel" data-od-id="power-concentration-panel">'];
    lines.push(renderCompactCloseRow());
    lines.push('<div class="dao-compact-context"><span>' + esc(detail.contextLabel || compactSectionContext('voter-concentration', '09 · Power Concentration')) + '</span><span>Ranked prefix</span></div>');
    lines.push('<header class="dao-compact-header"><h2 class="event-panel-title">Top ' + esc(indexedNumber(count)) + ' addresses</h2></header>');
    lines.push('<dl class="dao-compact-metrics dao-concentration-metrics">' +
      renderCompactMetric('Addresses', indexedNumber(count) + ' of ' + indexedNumber(detail.rankedVoterCount)) +
      renderCompactMetric('Participant share', indexedPercent(detail.voterPercent)) +
      renderCompactMetric('Cumulative observed VP', indexedPercent(detail.cumulativeObservedVotingPowerPercent)) +
      renderCompactMetric('Proposal coverage', indexedNumber(detail.voteCoveredProposalCount) + ' indexed') +
      '</dl>');
    lines.push('<section class="dao-compact-section"><div class="dao-compact-section-head"><h3>Highest observed cast power</h3><span>' + records.length + ' shown</span></div><ol class="dao-compact-record-list">');
    records.forEach((record, index) => {
      lines.push('<li><div class="dao-compact-concentration-record"><span>' + String(index + 1).padStart(2, '0') + '</span><code title="' + esc(record.voterAddress || record.voterId || '') + '">' + esc(truncateHash(record.voterAddress || record.voterId || 'Unavailable')) + '</code><strong>' + esc(indexedPower(record.totalObservedVotingPower) + ' VP') + '</strong><small>' + esc(indexedNumber(record.proposalsVoted) + ' proposals') + '</small></div></li>');
    });
    lines.push('</ol></section>');

    lines.push('</article>');
    return lines.join('');
  }


  function indexedMetric(label, value) {
    return '<div><span>' + esc(label) + '</span><strong>' + esc(value == null || value === '' ? 'Unavailable' : value) + '</strong></div>';
  }
  function indexedNumber(value) { return value == null ? 'Unavailable' : Number(value).toLocaleString('en-US'); }
  function indexedPercent(value) { return value == null ? 'Unavailable' : Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 }) + '%'; }
  function indexedPower(value) {
    if (value == null) return 'Unavailable';
    const n = Number(value);
    return Number.isFinite(n) ? n.toLocaleString('en-US', { maximumFractionDigits: 6 }) : String(value);
  }
  function indexedDate(value) { return value ? new Date(value).toLocaleDateString('en-CA', { timeZone: 'UTC' }) : 'Unavailable'; }
  function indexedDateTime(value) { return value ? new Date(value).toLocaleString('en-GB', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'short' }) + ' UTC' : 'Unavailable'; }
  function indexedBodyExcerpt(value) {
    const plain = String(value || '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_#>`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (plain.length <= 900) return plain;
    return plain.slice(0, 897).replace(/\s+\S*$/, '') + '…';
  }

  function renderTimelinePanelContent() {
    const proposals = getDaoTimelineProposals();
    const rows = proposals
      .map((proposal, index) => {
        const rowClass = timelineStatusClass(proposal.status);
        const token = proposal.token
          ? '<b class="timeline-panel-token">' + esc(proposal.token) + '</b>'
          : "";
        return (
          '<button class="proposal-timeline-panel-row ' +
          rowClass +
          '" type="button" data-timeline-proposal-id="' +
          esc(proposal.eventId) +
          '" data-timeline-title="' +
          esc(proposal.title) +
          '" data-timeline-status="' +
          esc(proposal.status) +
          '" data-timeline-summary="' +
          esc(proposal.summary) +
          '" title="' +
          esc(proposal.title) +
          '"><span class="timeline-panel-index">' +
          String(index + 1).padStart(2, "0") +
          '</span><time>' +
          esc(proposal.date) +
          '</time><span class="timeline-panel-status">' +
          esc(timelineStatusLabel(proposal.status)) +
          '</span><strong><span>' +
          token +
          esc(proposal.displayTitle) +
          '</span></strong></button>'
        );
      })
      .join("");

    return (
      '<div class="event-panel-close-row"><button class="event-panel-close" data-panel-close="" aria-label="Close proposal timeline">&times;</button></div>' +
      '<section class="proposal-timeline-panel" aria-label="All Uniswap proposals">' +
      '<div class="timeline-panel-kicker">DAO proposal archive</div>' +
      '<h2 class="event-panel-title timeline-panel-title">Uniswap proposals</h2>' +
      '<p class="timeline-panel-summary">100 proposals · Passed 88 · Failed 5 · Active 7 · Newest first</p>' +
      '<label class="timeline-panel-search"><span>Search proposals</span><input type="search" placeholder="Search title, tag, or status" aria-label="Search proposal title"></label>' +
      '<div class="timeline-panel-filters" aria-label="Proposal status filters"><button type="button" class="is-active">All 100</button><button type="button">Active 7</button><button type="button">Passed 88</button><button type="button">Failed 5</button></div>' +
      '<div class="proposal-timeline-panel-list" role="list" aria-label="All Uniswap proposals">' +
      rows +
      '</div>' +
      '<p class="timeline-panel-footnote">Click a proposal to inspect it in this same side panel. Proposal titles stay single-line; hover or focus reveals the full title.</p>' +
      '</section>'
    );
  }

  function getDaoTimelineProposals() {
    const templates = [
      ["evt-proposal-uniswap-v4", "active", "TEMP", "[Temp Check] Update Crosschain Governance Parameters for Avail", "Update crosschain governance…Avail"],
      ["evt-priority-uniswap-v4", "active", "TEMP", "[Temp Check] Protocol Fee Expansion: Unichain and mainnet", "Protocol fee expansion…mainnet"],
      ["evt-proposal-optimism-retro", "active", "", "Return 12.5M Delegated Tokens", "Return 12.5M delegated tokens"],
      ["evt-proposal-aave-risk", "active", "RFC", "[RFC] Governance Process Upgrade", "Governance process upgrade"],
      ["evt-proposal-aave-cbbtc", "active", "TEMP", "[Temp Check] Protocol Fee Expansion v2", "Protocol fee expansion v2"],
      ["evt-execution-arbitrum-grant", "active", "", "Strategic Renewal of Gnosis, Liquidity and Accountability Workstreams", "Strategic renewal: Gnosis…"],
      ["evt-priority-uniswap-v4", "active", "", "Unification", "Unification"],
      ["evt-proposal-compound-cusdc", "passed", "", "Uniswap Community Proposal Facilitation Budget", "Community proposal facilitation…"],
      ["evt-proposal-uniswap-v4", "passed", "", "Grow Uniswap on Plasma", "Grow Uniswap on Plasma"],
      ["evt-proposal-optimism-retro", "passed", "", "Treasury Delegation Round 2 Extension", "Treasury delegation round 2…"],
      ["evt-proposal-aave-cbbtc", "passed", "GL1", "GL1 - Incentivized Delegation", "Incentivized delegation"],
      ["evt-execution-arbitrum-grant", "executed", "GL1", "GL1 - Treasury Delegation Round", "Treasury delegation round"],
      ["evt-priority-uniswap-v4", "passed", "", "Launching Uniswap v3 on Ronin", "Launching Uniswap v3 on Ronin"],
      ["evt-proposal-uniswap-v4", "passed", "", "Establish Uniswap Governance Analytics Working Group", "Governance analytics working group"],
      ["evt-proposal-aave-risk", "passed", "RFC", "[RFC] Crosschain Bridge Provider Evaluation", "Crosschain bridge provider…"],
      ["evt-proposal-compound-cusdc", "defeated", "", "Alternate Quorum Threshold Test", "Alternate quorum threshold test"],
      ["evt-proposal-optimism-retro", "passed", "", "Delegate Communication Standards", "Delegate communication standards"],
      ["evt-execution-arbitrum-grant", "executed", "", "Developer Tooling Grant Renewal", "Developer tooling grant renewal"],
      ["evt-proposal-aave-cbbtc", "passed", "", "Treasury Reporting Cadence", "Treasury reporting cadence"],
      ["evt-proposal-compound-cusdc", "defeated", "", "Emergency Multisig Expansion", "Emergency multisig expansion"],
    ];
    const base = Date.UTC(2026, 6, 1, 14, 20);
    return Array.from({ length: 100 }, (_, index) => {
      const source = templates[index % templates.length];
      const status = index < 7 ? "active" : index >= 95 ? "defeated" : source[1];
      const cycle = Math.floor(index / templates.length);
      const title = cycle ? source[3] + " · cycle " + (cycle + 1) : source[3];
      return {
        eventId: source[0],
        status,
        token: source[2],
        title,
        displayTitle: cycle ? source[4] + " · c" + (cycle + 1) : source[4],
        date: formatCompactTimelineDate(base - index * 6 * 86400000 - (index % 5) * 3600000),
        summary:
          title +
          " is shown from the full DAO proposal timeline. Atlas keeps the user inside the side panel so the full archive and proposal detail view share one interaction model.",
      };
    });
  }

  function formatCompactTimelineDate(ts) {
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, "0");
    return pad(d.getUTCMonth() + 1) + "/" + pad(d.getUTCDate()) + " " + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes());
  }

  function timelineStatusClass(status) {
    if (status === "active") return "is-live";
    if (status === "executed") return "is-executed";
    if (status === "defeated") return "is-defeated";
    return "is-passed";
  }

  function timelineStatusLabel(status) {
    if (status === "active") return "LIVE";
    if (status === "executed") return "EXEC";
    if (status === "defeated") return "FAIL";
    return "PASS";
  }

  /* ── Helpers ───────────────────────────────────────────────────── */

  function esc(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fmt(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "k";
    return String(n);
  }

  function renderAgentCapabilityPanel(evt) {
    const c = evt.capability || {};
    const lines = [];
    const intros = {
      "cap-research-context":
        "Use this when an agent needs to turn Atlas proposal, forum, vote, and DAO-history context into a cited governance research memo or comparison.",
      "cap-security-review":
        "Use this when an agent needs to inspect executable proposal risk: permission changes, contracts touched, treasury movement, and payload review steps.",
      "cap-x402-access":
        "x402 is an open payment protocol for HTTP-native paid requests. It lets agents pay for premium API calls or governance workflows at request time, without a separate dashboard account or subscription flow.",
    };
    lines.push('<hr class="event-panel-divider">');
    lines.push('<section class="agent-panel-intro" aria-label="Agent-ready panel introduction">');
    lines.push('<span>' + esc(evt.id === "cap-x402-access" ? "Payment access" : c.label || "Agent skill") + '</span>');
    lines.push('<p>' + esc(intros[evt.id] || c.workflow || evt.description || "Agent-ready governance workflow.") + '</p>');
    lines.push('</section>');

    if (evt.id === "cap-research-context" || evt.id === "cap-security-review") {
      const skillName = evt.id === "cap-research-context" ? "dao-governance-research" : "dao-governance-security";
      const skillUrl = evt.links?.external || "https://github.com/ringecosystem/degov-agent-skills/tree/main/skills";
      const installMessage =
        "Install the " +
        skillName +
        " skill:\n" +
        skillUrl +
        "\nUse it with DeGov Atlas context for this DAO or proposal.";
      lines.push('<div class="event-panel-section-label">Install with your agent</div>');
      lines.push('<div class="agent-install-box">');
      lines.push('<div class="agent-install-head"><span>Copy this message to your agent to install this skill</span><button class="agent-copy-chip" type="button">Copy</button></div>');
      lines.push('<code>' + esc(installMessage) + '</code>');
      lines.push('</div>');
      lines.push('<div class="event-panel-section-label">What it uses</div>');
      lines.push('<div class="event-panel-metric-grid agent-panel-grid">');
      if (c.inputs) lines.push(metricCard("Inputs", esc(c.inputs), "Atlas context"));
      if (c.outputs) lines.push(metricCard("Outputs", esc(c.outputs), "agent-ready"));
      lines.push("</div>");
      lines.push(...renderEvidenceLinks(evt, "Skill Links"));
      return lines;
    }

    lines.push('<div class="event-panel-section-label">How x402 fits here</div>');
    lines.push('<div class="x402-link-stack">');
    lines.push('<p>Atlas can keep free public discovery separate from paid, agent-grade endpoints. x402 provides the payment handshake for those metered requests, while the response still returns normal HTTP data.</p>');
    lines.push('</div>');
    lines.push(...renderEvidenceLinks(evt, "External Links"));
    return lines;
  }

  function renderSignalPanel(evt) {
    const lines = [];
    const summary = evt.proposal?.aiSummary || evt.description || evt.forum?.excerpt || evt.importanceReason || evt.title;
    lines.push('<hr class="event-panel-divider">');
    lines.push(renderAiAnalysisPanel(evt, summary));

    if (evt.type === "forum" && evt.forum) {
      lines.push('<div class="event-panel-section-label">Discussion Window</div>');
      lines.push('<div class="event-panel-metric-grid event-panel-metric-grid-simple discussion-window-grid">');
      if (evt.happenedAt) lines.push(metricCard("Updated", formatPanelDate(evt.happenedAt), formatTime(evt.happenedAt)));
      if (evt.forum.replyCount != null) lines.push(metricCard("Replies", esc(String(evt.forum.replyCount)), evt.forum.participantCount != null ? esc(String(evt.forum.participantCount)) + " participants" : ""));
      lines.push("</div>");
      lines.push(...renderEvidenceLinks(evt, "Quick Links"));
    }
    return lines;
  }

  function renderAiAnalysisPanel(evt, summary) {
    const contextSources = evt.type === "proposal"
      ? ["proposal", "votes", "dao activity", "timeline", "voter context"]
      : ["forum", "dao activity", "timeline", "participants", "source thread"];
    const sourceRows = contextSources
      .map((source, index) => {
        const status = index === 0 ? "reading" : index < 3 ? "pending" : "queued";
        return '<span class="ai-source-chip" data-source-index="' + index + '" data-source-state="' + status + '"><span class="ai-source-dot" aria-hidden="true"></span>' + esc(source) + '<em>' + status + '</em></span>';
      })
      .join("");
    const result = buildAiAnalysisResult(evt, summary);
    const bullets = result.bullets.map((item) => '<li>' + esc(item) + '</li>').join("");
    const outcome = result.outcomes.map((item) => '<span><b>' + esc(item.label) + '</b>' + esc(item.value) + '</span>').join("");
    return (
      '<section class="ai-analysis-panel" data-ai-analysis data-analysis-state="loading" aria-live="polite">' +
      '<div class="ai-analysis-head"><div><div class="event-panel-section-label ai-analysis-label">ai analysis</div><p class="ai-analysis-status" data-analysis-status>reading governance context...</p></div><span class="ai-analysis-state-chip" data-analysis-chip><span aria-hidden="true"></span> active</span></div>' +
      '<div class="ai-source-grid" aria-label="Analysis source status">' + sourceRows + '</div>' +
      '<div class="ai-analysis-progress" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>' +
      '<div class="ai-state-layer ai-state-loading"><p>Reading proposal text, vote timing, DAO context, and voter activity.</p><div class="ai-skeleton-lines" aria-hidden="true"><span></span><span></span><span></span></div></div>' +
      '<div class="ai-state-layer ai-state-streaming"><p class="ai-terminal-line">generating governance brief<span class="ai-cursor" aria-hidden="true"></span></p><p class="ai-stream-copy">Checking evidence consistency before returning a concise proposal signal.</p></div>' +
      '<div class="ai-state-layer ai-state-complete"><p class="ai-tldr"><span>tl;dr</span>' + esc(result.tldr) + '</p><ul class="ai-insight-list">' + bullets + '</ul><div class="ai-outcome-row">' + outcome + '</div></div>' +
      '<div class="ai-state-layer ai-state-error"><p><span>analysis unavailable</span> The request timed out before Atlas could return a trustworthy brief.</p><button type="button" data-analysis-action="retry">retry analysis</button></div>' +
      '<div class="ai-analysis-footer"><span data-analysis-meta>deepseek v4 flash · generating now</span><div class="ai-analysis-actions"><button type="button" data-analysis-action="copy">copy</button><button type="button" data-analysis-action="regenerate">regenerate</button><button type="button" data-analysis-action="sources">show sources</button></div></div>' +
      '<div class="ai-sources-used" data-analysis-sources hidden>Analysis uses proposal content, voting context, and recent DAO activity: ' + esc(contextSources.join(" · ")) + '</div>' +
      '</section>'
    );
  }

  function buildAiAnalysisResult(evt, summary) {
    const p = evt.proposal;
    const titleSubject = evt.daoName ? evt.daoName + " signal" : "Governance signal";
    const tldr = summary.length > 112 ? summary.slice(0, 109).replace(/\s+\S*$/, "") + "..." : summary;
    const bullets = [];
    if (p?.turnout != null) bullets.push("Participation is visible enough to compare against normal DAO activity.");
    if (p?.voteDistribution) {
      const forPct = p.voteDistribution.for;
      const againstPct = p.voteDistribution.against;
      if (forPct != null && againstPct != null) bullets.push("Current posture is " + forPct + "% for / " + againstPct + "% against.");
    }
    if (p?.endAt) bullets.push(p.endAt > Date.now() ? "Decision window remains open; execution assumptions are not final." : "Voting is closed; use this as post-vote context.");
    bullets.push(evt.type === "forum" ? "Thread activity is context, not a final on-chain decision." : titleSubject + " is grounded in proposal text, vote timing, and DAO activity.");
    while (bullets.length < 3) bullets.push("Atlas compares proposal evidence with recent governance activity before summarizing.");
    const outcomes = [];
    if (evt.status) outcomes.push({ label: "status", value: formatStatusLabel(evt.status).toLowerCase() });
    if (p?.totalVotes) outcomes.push({ label: "votes", value: p.totalVotes });
    else if (p?.uniqueVoters) outcomes.push({ label: "voters", value: fmt(p.uniqueVoters) });
    if (p?.turnout != null) outcomes.push({ label: "participation", value: String(p.turnout) + "%" });
    if (!outcomes.length && evt.forum?.replyCount != null) outcomes.push({ label: "replies", value: String(evt.forum.replyCount) });
    return { tldr, bullets: bullets.slice(0, 3), outcomes };
  }

  function initAiAnalysisFlows(root) {
    root.querySelectorAll("[data-ai-analysis]").forEach((panel) => {
      const timers = [];
      const setState = (state) => {
        panel.dataset.analysisState = state;
        const status = panel.querySelector("[data-analysis-status]");
        const chip = panel.querySelector("[data-analysis-chip]");
        const meta = panel.querySelector("[data-analysis-meta]");
        if (state === "loading") {
          if (status) status.textContent = "reading governance context...";
          if (chip) chip.innerHTML = '<span aria-hidden="true"></span> active';
          if (meta) meta.textContent = "deepseek v4 flash · generating now";
          updateSourceStates(panel, ["reading", "pending", "pending", "queued", "queued"]);
        } else if (state === "streaming") {
          if (status) status.textContent = "analyzing governance signal...";
          if (chip) chip.innerHTML = '<span aria-hidden="true"></span> streaming';
          if (meta) meta.textContent = "deepseek v4 flash · streaming now";
          updateSourceStates(panel, ["ready", "ready", "reading", "reading", "pending"]);
        } else if (state === "complete") {
          if (status) status.textContent = "analysis complete";
          if (chip) chip.innerHTML = '<span aria-hidden="true"></span> ready';
          if (meta) meta.textContent = "deepseek v4 flash · generated now";
          updateSourceStates(panel, ["ready", "ready", "ready", "ready", "ready"]);
        } else if (state === "error") {
          if (status) status.textContent = "analysis paused";
          if (chip) chip.innerHTML = '<span aria-hidden="true"></span> retry';
          if (meta) meta.textContent = "deepseek v4 flash · request timed out";
          updateSourceStates(panel, ["ready", "ready", "ready", "pending", "pending"]);
        }
      };
      const schedule = () => {
        timers.splice(0).forEach(clearTimeout);
        setState("loading");
        timers.push(setTimeout(() => setState("streaming"), 900));
        timers.push(setTimeout(() => setState("complete"), 2300));
      };
      panel.querySelectorAll("[data-analysis-action]").forEach((button) => {
        button.addEventListener("click", () => {
          const action = button.dataset.analysisAction;
          if (action === "regenerate" || action === "retry") schedule();
          if (action === "error") {
            timers.splice(0).forEach(clearTimeout);
            setState("error");
          }
          if (action === "sources") {
            const sources = panel.querySelector("[data-analysis-sources]");
            if (sources) sources.hidden = !sources.hidden;
            button.textContent = sources && !sources.hidden ? "hide sources" : "show sources";
          }
          if (action === "copy") {
            const text = panel.querySelector(".ai-state-complete")?.innerText || "";
            navigator.clipboard?.writeText?.(text).catch(() => {});
            button.textContent = "copied";
            setTimeout(() => {
              button.textContent = "copy";
            }, 1400);
          }
        });
      });
      schedule();
    });
  }

  function updateSourceStates(panel, states) {
    panel.querySelectorAll(".ai-source-chip").forEach((chip, index) => {
      const state = states[index] || "pending";
      chip.dataset.sourceState = state;
      const label = chip.querySelector("em");
      if (label) label.textContent = state;
    });
  }

  function metricCard(label, value, sub) {
    return (
      '<div class="event-panel-metric">' +
      '<dt>' +
      esc(label) +
      "</dt>" +
      '<dd>' +
      esc(value) +
      "</dd>" +
      (sub ? "<small>" + esc(sub) + "</small>" : "") +
      "</div>"
    );
  }

  function renderEvidenceLinks(evt, label) {
    const lines = [];
    if ((!evt.links || Object.keys(evt.links).length === 0) && !evt.sourceUrl) return lines;
    lines.push('<hr class="event-panel-divider event-panel-divider-compact">');
    lines.push('<div class="event-panel-section-label">' + esc(label || "Evidence Links") + '</div>');
    lines.push('<div class="event-panel-links event-panel-links-compact">');
    if (evt.links?.external) {
      lines.push(
        '<a class="event-panel-link" href="' +
          esc(evt.links.external) +
          '" target="_blank" rel="noopener noreferrer">' +
          esc(evt.links.externalLabel ?? (evt.type === "proposal" ? "Open proposal ↗" : evt.type === "forum" ? "Open discussion ↗" : "View source ↗")) +
          "</a>"
      );
    }
    if (evt.links?.skillIndex) {
      lines.push(
        '<a class="event-panel-link" href="' +
          esc(evt.links.skillIndex) +
          '" target="_blank" rel="noopener noreferrer">' +
          esc(evt.links.skillIndexLabel ?? "Browse agent skills ↗") +
          "</a>"
      );
    }
    if (evt.links?.forum) {
      lines.push(
        '<a class="event-panel-link" href="' +
          esc(evt.links.forum) +
          '" target="_blank" rel="noopener noreferrer">Open Forum &nearr;</a>'
      );
    }
    if (evt.sourceUrl && !evt.links?.external) {
      lines.push(
        '<a class="event-panel-link" href="' +
          esc(evt.sourceUrl) +
          '" target="_blank" rel="noopener noreferrer">View source &nearr;</a>'
      );
    }
    lines.push("</div>");
    return lines;
  }

  function formatEventType(type) {
    const map = {
      proposal: "Proposal",
      forum: "Forum",
      execution: "Execution",
      treasury: "Treasury",
      "agent-skill": "Agent-ready layer",
    };
    return map[type] ?? type;
  }

  function formatEventKind(kind) {
    if (!kind) return "event";
    return String(kind).replace(/[_-]+/g, " ");
  }

  function formatCoverageLabel(state) {
    if (!state) return "coverage unavailable";
    const map = {
      fresh: "fresh",
      partial: "partial",
      stale: "stale",
      degraded: "degraded",
      unknown: "unknown",
      not_available_for_source: "not available",
      not_normalized_yet: "not normalized",
    };
    return map[state] ?? String(state).replace(/[_-]+/g, " ");
  }

  function formatStatusLabel(status) {
    const map = {
      active: "Active",
      passed: "Passed",
      defeated: "Defeated",
      executed: "Executed",
      "ending-soon": "Ending soon",
      discussion: "Discussion",
      unknown: "Unknown",
    };
    return map[status] ?? status;
  }

  function statusToCssClass(status) {
    const map = {
      active: "state-active",
      passed: "state-passed",
      defeated: "state-defeated",
      executed: "state-executed",
      "ending-soon": "state-ending-soon",
      discussion: "state-fresh",
    };
    return map[status] ?? "state-active";
  }

  function formatTime(ts) {
    if (!ts) return "";
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return mins <= 1 ? "1 min ago" : mins + " min ago";
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + "h ago";
    const days = Math.floor(hours / 24);
    if (days < 7) return days + "d ago";
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  function formatPanelDate(ts) {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDuration(ms) {
    const days = Math.floor(ms / 86400000);
    if (days >= 1) return days + " day" + (days > 1 ? "s" : "");
    const hours = Math.floor(ms / 3600000);
    return hours + "h";
  }

  function truncateHash(hash) {
    if (!hash || hash.length <= 14) return hash;
    // If it's an address label like "Lido Treasury (0x...)", return as-is
    if (hash.includes("(")) return hash;
    return hash.slice(0, 6) + "..." + hash.slice(-4);
  }

  /* ── Public API ────────────────────────────────────────────────── */

  return {
    init,
    open,
    openTimeline,
    openProposalDecision,
    openProposalCreator,
    openParticipationFrequency,
    openGovernanceSetup,
    openProposalActivityMonth,
    openProposalParticipation,
    openEstablishedVoter,
    openTypicalPower,
    openPowerConcentration,
    close,
  };
})();


/* ── DAO search prototype ─────────────────────────────────────────── */
function initDaoSearch() {
  const forms = document.querySelectorAll("[data-dao-search]");
  if (!forms.length) return;

  function normalize(value) {
    return (value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  function compact(value) {
    return normalize(value).replace(/\s+/g, "");
  }

  function fuzzyMatch(needle, haystack) {
    let cursor = 0;
    for (const char of haystack) {
      if (char === needle[cursor]) cursor += 1;
      if (cursor === needle.length) return true;
    }
    return false;
  }

  forms.forEach((form) => {
    const input = form.querySelector("input");
    const heading = form.querySelector("[data-search-heading]");
    const empty = form.querySelector(".search-assist-empty");
    const options = Array.from(form.querySelectorAll("[data-dao-option]"));
    if (!input || !heading || !empty || !options.length) return;

    function score(option, query) {
      const normalized = normalize(query);
      const tight = compact(query);
      const label = compact(option.querySelector("strong")?.textContent || "");
      const haystack = compact(`${option.textContent || ""} ${option.dataset.search || ""}`);
      if (!normalized || !tight) return Number(option.dataset.defaultRank || 99);
      if (label === tight) return 0;
      if (label.startsWith(tight)) return 1;
      const index = haystack.indexOf(tight);
      if (index >= 0) return 5 + index / 100;
      if (tight.length < 4) return Infinity;
      return fuzzyMatch(tight, haystack) ? 40 : Infinity;
    }

    function render() {
      const query = input.value;
      const isQuery = Boolean(normalize(query));
      const ranked = options
        .map((option) => ({ option, score: score(option, query) }))
        .filter((entry) => Number.isFinite(entry.score))
        .sort((left, right) => left.score - right.score)
        .slice(0, isQuery ? 7 : 7);
      const visible = new Set(ranked.map((entry) => entry.option));
      options.forEach((option) => {
        option.hidden = !visible.has(option);
        option.classList.toggle("is-selected", ranked[0]?.option === option);
      });
      heading.textContent = isQuery ? "Matching DAOs" : "Recently active DAOs";
      empty.hidden = ranked.length > 0;
    }

    const previewSearch = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("search");
    if (previewSearch && !input.value) {
      input.value = previewSearch;
      form.classList.add("is-search-preview");
    }

    input.addEventListener("input", render);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        input.value = "";
        render();
      }
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const selected = form.querySelector("[data-dao-option].is-selected:not([hidden])");
      if (selected instanceof HTMLAnchorElement) selected.click();
    });
    render();
  });
}

/* ── Event delegation ─────────────────────────────────────────────── */

function initEventPanelTriggers() {
  EventPanel.init();

  const triggerSelector = [
    ".bulletin-item",
    ".governance-update-row",
    ".latest-signal-line",
    ".dao-latest-signal",
    ".compact-line-list > a",
    ".history-timeline-row",
    ".issue-item-row",
    ".agent-capability-card",
    ".priority-signal-list > a",
    ".priority-signal-list > div",
  ].join(", ");

  document.addEventListener("click", function (e) {
    /* Ignore clicks on close/backdrop buttons */
    if (e.target.closest("[data-panel-close]")) return;

    const fullTimelineTrigger = e.target.closest("[data-full-timeline-open]");
    if (fullTimelineTrigger) {
      e.preventDefault();
      EventPanel.openTimeline(fullTimelineTrigger);
      return;
    }

    const timelineBack = e.target.closest("[data-panel-timeline-back]");
    if (timelineBack) {
      e.preventDefault();
      EventPanel.openTimeline(timelineBack);
      return;
    }

    const timelineProposal = e.target.closest("[data-timeline-proposal-id]");
    if (timelineProposal) {
      e.preventDefault();
      const proposalId = timelineProposal.getAttribute("data-timeline-proposal-id");
      EventPanel.open(proposalId, timelineProposal, {
        backToTimeline: true,
        eventData: buildTimelineProposalEvent(timelineProposal, proposalId),
      });
      return;
    }

    const trigger = e.target.closest(triggerSelector);
    if (!trigger) return;

    const eventId = trigger.getAttribute("data-event-id");
    if (!eventId) return;

    e.preventDefault();
    EventPanel.open(eventId, trigger);
  });

  function buildTimelineProposalEvent(trigger, eventId) {
    const base = MOCK_EVENTS[eventId] || MOCK_EVENTS["evt-proposal-uniswap-v4"] || {};
    const status = trigger.getAttribute("data-timeline-status") || base.status || "passed";
    const title = trigger.getAttribute("data-timeline-title") || base.title || "Governance proposal";
    const summary = trigger.getAttribute("data-timeline-summary") || base.description || title;
    return {
      ...base,
      id: eventId,
      type: "proposal",
      daoName: "Uniswap",
      title,
      status,
      happenedAt: Date.now(),
      description: summary,
      proposal: {
        ...(base.proposal || {}),
        aiSummary: summary,
      },
    };
  }
}

function initOlderProposalsPanel() {
  const panel = document.getElementById("older-proposals-panel");
  if (!panel) return;

  const sheet = panel.querySelector(".older-proposals-sheet");
  const openButtons = document.querySelectorAll("[data-older-proposals-open]");
  const closeButtons = panel.querySelectorAll("[data-older-proposals-close]");
  let triggerElement = null;

  function focusableItems() {
    return Array.from(
      panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter((item) => !item.disabled && item.offsetParent !== null);
  }

  function open(trigger) {
    triggerElement = trigger;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    panel.removeAttribute("inert");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      const closeButton = panel.querySelector(".older-proposals-close");
      if (closeButton) closeButton.focus();
    });
    document.addEventListener("keydown", handleKeydown);
  }

  function close() {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("inert", "");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleKeydown);
    if (triggerElement) triggerElement.focus({ preventScroll: true });
    triggerElement = null;
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;

    const items = focusableItems();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", () => open(button));
  });
  closeButtons.forEach((button) => {
    button.addEventListener("click", close);
  });
  panel.addEventListener("click", (event) => {
    if (event.target.matches("[data-older-proposals-close]")) close();
  });
  if (sheet) {
    sheet.addEventListener("click", (event) => event.stopPropagation());
  }
}

/* ── DAO detail local data navigator ─────────────────────────────── */
const DAO_DATA_SECTIONS = [
  { id: 'dao-overview', title: 'Overview', shortTitle: 'Overview', order: 1 },
  { id: 'proposal-explorer', title: 'Proposal Explorer', shortTitle: 'Proposals', order: 2 },
  { id: 'proposal-activity', title: 'Proposal Activity', shortTitle: 'Activity', order: 3 },
  { id: 'proposal-creators', title: 'Proposal Creators', shortTitle: 'Creators', order: 4 },
  { id: 'proposal-timeline', title: 'Participation by Proposal', shortTitle: 'Participation', order: 5 },
  { id: 'top-voters', title: 'Established Voters', shortTitle: 'Established', order: 6 },
  { id: 'voting-depth', title: 'Participation Frequency', shortTitle: 'Frequency', order: 7 },
  { id: 'power-distribution', title: 'Typical Voting Power', shortTitle: 'Voting Power', order: 8 },
  { id: 'voter-concentration', title: 'Power Concentration', shortTitle: 'Concentration', order: 9 },
];

function initDaoDataIndex() {
  const dashboard = document.querySelector('.dao-detail-dashboard');
  const desktopMount = document.querySelector('[data-dao-data-index-desktop]');
  const tabletMount = document.querySelector('[data-dao-data-index-tablet]');
  const mobileMount = document.querySelector('[data-dao-data-index-mobile]');
  if (!dashboard || !desktopMount || !tabletMount || !mobileMount) return;

  const sections = DAO_DATA_SECTIONS.map((item) => ({ ...item, target: document.getElementById(item.id) }));
  if (sections.some((item) => !item.target)) {
    console.error('DAO data index: one or more registered sections are missing.');
    return;
  }

  const indexButton = (item, variant) => {
    const number = String(item.order).padStart(2, '0');
    return '<button type="button" class="dao-data-index-item" data-data-index-target="' + item.id + '" data-index-variant="' + variant + '"><span class="dao-data-index-number">' + number + '</span><span>' + item.title + '</span></button>';
  };

  const indexItems = (variant) => sections.map((item) => indexButton(item, variant)).join('');

  desktopMount.innerHTML = '<span class="dao-data-index-label">DAO DATA INDEX</span><div class="dao-data-index-list">' + indexItems('desktop') + '</div>';
  tabletMount.innerHTML = '<div class="dao-section-nav-track">' + indexItems('tablet') + '</div><span class="dao-section-nav-overflow-cue" aria-hidden="true">→</span>';
  mobileMount.innerHTML = '<button type="button" class="dao-section-selector-trigger" aria-expanded="false" aria-controls="dao-section-selector-menu"><span>SECTION · <strong data-data-index-mobile-label>OVERVIEW</strong></span><span aria-hidden="true">▾</span></button><div id="dao-section-selector-menu" class="dao-section-selector-menu" hidden><div class="dao-section-selector-head"><span>DAO DATA INDEX</span><button type="button" aria-label="Close section navigator" data-data-index-mobile-close>×</button></div><div class="dao-data-index-list">' + indexItems('mobile') + '</div></div>';

  const main = document.querySelector('.atlas-main');
  const mobileTrigger = mobileMount.querySelector('.dao-section-selector-trigger');
  const mobileMenu = mobileMount.querySelector('.dao-section-selector-menu');
  const mobileLabel = mobileMount.querySelector('[data-data-index-mobile-label]');
  const tabletTrack = tabletMount.querySelector('.dao-section-nav-track');
  let activeId = sections[0].id;
  let animationFrame = 0;
  let navigationLockUntil = 0;

  function scrollRoot() {
    return window.matchMedia('(min-width: 1101px)').matches ? main : null;
  }

  function stickyOffset() {
    const commandStrip = document.querySelector('.atlas-command-strip');
    const tabletIndex = document.querySelector('[data-dao-data-index-tablet]');
    const mobileIndex = document.querySelector('[data-dao-data-index-mobile]');
    const commandHeight = commandStrip ? commandStrip.getBoundingClientRect().height : 0;
    const localHeight = window.matchMedia('(max-width: 759px)').matches
      ? mobileIndex.getBoundingClientRect().height
      : window.matchMedia('(max-width: 1439px)').matches
        ? tabletIndex.getBoundingClientRect().height
        : 0;
    return commandHeight + localHeight + 16;
  }

  function setActive(id) {
    if (!sections.some((item) => item.id === id)) return;
    activeId = id;
    const item = sections.find((section) => section.id === id);
    document.querySelectorAll('[data-data-index-target]').forEach((button) => {
      const active = button.dataset.dataIndexTarget === id;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'location');
      else button.removeAttribute('aria-current');
    });
    mobileLabel.textContent = item.shortTitle.toUpperCase();
    const activeTabletButton = tabletTrack.querySelector('[data-data-index-target="' + id + '"]');
    if (activeTabletButton && getComputedStyle(tabletMount).display !== 'none') {
      const mountRect = tabletTrack.getBoundingClientRect();
      const buttonRect = activeTabletButton.getBoundingClientRect();
      if (buttonRect.left < mountRect.left + 8 || buttonRect.right > mountRect.right - 8) {
        tabletTrack.scrollTo({
          left: Math.max(0, tabletTrack.scrollLeft + buttonRect.left + buttonRect.width / 2 - mountRect.left - mountRect.width / 2),
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        });
      }
    }
    requestAnimationFrame(updateTabletOverflow);
  }

  function updateTabletOverflow() {
    const maxScroll = Math.max(0, tabletTrack.scrollWidth - tabletTrack.clientWidth);
    tabletMount.classList.toggle('has-overflow-left', tabletTrack.scrollLeft > 4);
    tabletMount.classList.toggle('has-overflow-right', tabletTrack.scrollLeft < maxScroll - 4);
  }

  function closeMobileMenu(restoreFocus) {
    if (mobileMenu.hidden) return;
    mobileMenu.hidden = true;
    mobileTrigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-dao-index-menu-open');
    if (restoreFocus) mobileTrigger.focus({ preventScroll: true });
  }

  function navigateTo(id, updateHash, instant) {
    const item = sections.find((section) => section.id === id);
    if (!item) return;
    closeMobileMenu(false);
    setActive(id);
    const root = scrollRoot();
    const offset = stickyOffset();
    const behavior = instant || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    navigationLockUntil = performance.now() + (behavior === 'smooth' ? 1800 : 120);
    if (root) {
      const top = root.scrollTop + item.target.getBoundingClientRect().top - root.getBoundingClientRect().top - offset;
      root.scrollTo({ top: Math.max(0, top), behavior });
    } else {
      const top = window.scrollY + item.target.getBoundingClientRect().top - offset;
      window.scrollTo({ top: Math.max(0, top), behavior });
    }
    if (updateHash) history.replaceState(null, '', '#' + id);
    if (behavior === 'instant') {
      requestAnimationFrame(() => {
        navigationLockUntil = 0;
        scheduleGeometryUpdate();
      });
    }
  }

  document.querySelectorAll('[data-data-index-target]').forEach((button) => {
    button.addEventListener('click', () => navigateTo(button.dataset.dataIndexTarget, true));
  });

  mobileTrigger.addEventListener('click', () => {
    const willOpen = mobileMenu.hidden;
    mobileMenu.hidden = !willOpen;
    mobileTrigger.setAttribute('aria-expanded', String(willOpen));
    document.body.classList.toggle('is-dao-index-menu-open', willOpen);
    if (willOpen) mobileMenu.querySelector('[aria-current="location"]')?.focus({ preventScroll: true });
  });
  mobileMount.querySelector('[data-data-index-mobile-close]').addEventListener('click', () => closeMobileMenu(true));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !mobileMenu.hidden) closeMobileMenu(true);
  });
  document.addEventListener('click', (event) => {
    if (!mobileMenu.hidden && !mobileMount.contains(event.target)) closeMobileMenu(false);
  });
  document.addEventListener('atlas:panel-open', () => closeMobileMenu(false));
  tabletTrack.addEventListener('scroll', updateTabletOverflow, { passive: true });

  function updateFromGeometry() {
    animationFrame = 0;
    if (performance.now() < navigationLockUntil) return;
    const offset = stickyOffset() + 12;
    const passed = sections.map((item) => ({ item, top: item.target.getBoundingClientRect().top })).filter((entry) => entry.top <= offset);
    let candidate = sections[0];
    if (passed.length) {
      candidate = passed.reduce((latest, entry) => entry.top > latest.top ? entry : latest).item;
    }
    const hashItem = sections.find((item) => '#' + item.id === location.hash);
    let hashItemVisible = false;
    if (hashItem) {
      const hashRect = hashItem.target.getBoundingClientRect();
      hashItemVisible = hashRect.top < window.innerHeight * 0.55 && hashRect.bottom > offset;
      if (hashItemVisible) candidate = hashItem;
    }
    const finalRow = sections.slice(-2);
    const root = scrollRoot();
    const scrollingElement = root || document.scrollingElement;
    const atEnd = scrollingElement.scrollTop + scrollingElement.clientHeight >= scrollingElement.scrollHeight - 4;
    if (atEnd && !hashItemVisible) {
      candidate = finalRow[finalRow.length - 1];
    }
    if (candidate.id !== activeId) setActive(candidate.id);
  }

  function scheduleGeometryUpdate() {
    if (!animationFrame) animationFrame = requestAnimationFrame(updateFromGeometry);
  }

  const observer = new IntersectionObserver(scheduleGeometryUpdate, {
    root: scrollRoot(),
    rootMargin: '-' + Math.round(stickyOffset()) + 'px 0px -58% 0px',
    threshold: [0, 0.01, 0.2, 0.6],
  });
  sections.forEach((item) => observer.observe(item.target));
  window.addEventListener('scroll', scheduleGeometryUpdate, { passive: true });
  main.addEventListener('scroll', scheduleGeometryUpdate, { passive: true });
  window.addEventListener('resize', () => { scheduleGeometryUpdate(); updateTabletOverflow(); }, { passive: true });

  setActive(activeId);
  updateTabletOverflow();
  if (location.hash && sections.some((item) => '#' + item.id === location.hash)) {
    requestAnimationFrame(() => requestAnimationFrame(() => navigateTo(location.hash.slice(1), false, true)));
  } else {
    scheduleGeometryUpdate();
  }
}

/* ── DAO detail participation explorer ───────────────────────────── */
function initDaoParticipationExplorer() {
  const root = document.querySelector('.dao-detail-dashboard');
  if (!root) return;
  const q = (selector) => root.querySelector(selector);
  const escapeHtml = (value) => String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const formatNumber = (value) => Number(value).toLocaleString('en-US');
  const formatPercent = (value) => Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 }) + '%';
  const formatPower = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return String(value ?? 'Unavailable');
    if (Math.abs(n) >= 1000000) return (n / 1000000).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'M';
    if (Math.abs(n) >= 1000) return (n / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 }) + 'k';
    return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };
  const formatDate = (value) => new Date(value).toLocaleDateString('en-CA', { timeZone: 'UTC' });
  const formatMonth = (value) => new Date(value + '-01T00:00:00Z').toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' });
  const formatMonthLong = (value) => new Date(value + '-01T00:00:00Z').toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const formatDateTime = (value) => new Date(value).toLocaleString('en-GB', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'short' }) + ' UTC';
  const compactAddress = (value) => String(value).length > 16 ? String(value).slice(0, 8) + '…' + String(value).slice(-6) : String(value);
  const formatCoverageStatus = (value) => String(value || 'unknown').replace(/_/g, '-');
  const hasEncodedChoicePayloads = (choices) => choices.some((choice) => /^[{[]/.test(String(choice.label || '').trim()));
  let sample = null;
  let proposalRows = [];
  let proposalActivityMonths = [];
  let visibleLimit = 10;
  let proposalTimeRange = 'all';

  function buildProposalActivityMonths(data) {
    const indexedMonths = data.drilldowns?.proposalActivityMonths || [];
    const prototypeCounts = [3, 5, 2, 7, 4, 6, 3, 8, 5, 2, 6, 4, 9, 3, 7, 5, 4];
    const prototypeTitles = [
      '[Temperature Check] Cross-chain deployment proposal',
      '[RFC] Governance process update',
      'Treasury delegation framework',
      'Protocol grants program renewal',
      'Fee switch research proposal',
      'Community governance working group',
      'Liquidity incentives pilot',
      'Delegate accountability framework',
      'Protocol security budget',
      'Governance tooling improvement proposal',
    ];
    const prototypeProposers = [
      '0x18d12A64f3D22C2cA7B6A8E76Db38b2f03bB1A21',
      '0x4A7f3B5dC92E0a6A29E79cD34fD70dF8c4B8A930',
      '0x82C1dE43a7C0A9E81B62CF2E5C8D2D10B4B9E770',
      '0xB71e4E2B3F8F5a1d0D8C1B7eE5C83a1F65A29442',
    ];
    const prototypeOutcomes = ['passed', 'passed', 'unknown', 'failed'];
    const prototypeMonths = prototypeCounts.map((proposalCount, monthIndex) => {
      const monthDate = new Date(Date.UTC(2022, monthIndex, 1));
      const month = monthDate.toISOString().slice(0, 7);
      const proposals = Array.from({ length: proposalCount }, (_, proposalIndex) => {
        const createdDay = Math.min(26, 3 + proposalIndex * 4);
        const createdAt = new Date(Date.UTC(monthDate.getUTCFullYear(), monthDate.getUTCMonth(), createdDay, 12));
        const endAt = new Date(createdAt.getTime() + 5 * 24 * 60 * 60 * 1000);
        const uniqueVoters = 180 + ((monthIndex * 137 + proposalIndex * 83) % 2900);
        const totalVotingPower = 1800000 + ((monthIndex * 925000 + proposalIndex * 475000) % 28000000);
        return {
          id: 'uniswapgovernance-eth:snapshot:mock:' + month + ':' + (proposalIndex + 1),
          title: prototypeTitles[(monthIndex * 2 + proposalIndex) % prototypeTitles.length],
          source: 'snapshot',
          proposerId: prototypeProposers[(monthIndex + proposalIndex) % prototypeProposers.length],
          lifecycleStatus: 'closed',
          outcome: prototypeOutcomes[(monthIndex + proposalIndex) % prototypeOutcomes.length],
          createdAt: createdAt.toISOString(),
          endAt: endAt.toISOString(),
          participation: {
            uniqueVoters,
            effectiveBallots: uniqueVoters,
            totalVotingPower: String(totalVotingPower),
            quorumRequired: null,
            quorumProgressPercent: null,
            quorumReached: null,
          },
        };
      });
      return { month, proposalCount, proposals, isPrototypeMock: true };
    });
    return [...prototypeMonths, ...indexedMonths];
  }

  fetch('backend-sample-uniswap.json', { cache: 'no-store' })
    .then((response) => { if (!response.ok) throw new Error('Sample request failed'); return response.json(); })
    .then((data) => {
      sample = data;
      proposalRows = buildProposalRows(data);
      proposalActivityMonths = buildProposalActivityMonths(data);
      renderSample();
    }, () => {
      root.querySelectorAll('[data-overview-metrics],[data-proposal-rows],[data-voting-depth],[data-top-voters],[data-typical-power],[data-concentration-curve],[data-proposal-creators],[data-proposal-time-chart]').forEach((el) => {
        el.innerHTML = '<div class="proposal-empty">Governance data is unavailable right now.</div>';
      });
    });

  function buildProposalRows(data) {
    const detailedById = new Map((data.proposalRows || []).map((row) => [row.id, row]));
    const indexed = data.drilldowns?.indexedProposals || data.proposalRows || [];
    return indexed.map((row) => {
      const detail = detailedById.get(row.id);
      const participation = row.participation || {};
      const normalizedParticipation = {
        ...participation,
        totalEffectiveBallots: participation.totalEffectiveBallots ?? participation.effectiveBallots ?? 0,
        quorumProgress: participation.quorumProgress ?? (participation.quorumProgressPercent == null ? null : participation.quorumProgressPercent / 100),
      };
      if (detail) {
        return {
          ...row,
          ...detail,
          participation: { ...normalizedParticipation, ...(detail.participation || {}) },
        };
      }
      return {
        ...row,
        choices: [],
        limitations: ['Per-choice distribution is not included in this evidence record.'],
        participation: normalizedParticipation,
      };
    });
  }

  function renderSample() {
    const dao = sample.dao;
    const coverage = sample.coverage;
    const asOf = formatDateTime(dao.dataAsOf);
    const outcomeCounts = proposalRows.reduce((counts, row) => {
      const outcome = row.outcome || 'unknown';
      counts[outcome] = (counts[outcome] || 0) + 1;
      return counts;
    }, {});
    const proposalCreatedDates = proposalRows
      .map((row) => row.createdAt)
      .filter(Boolean)
      .sort((a, b) => new Date(a) - new Date(b));
    const firstProposalAt = proposalCreatedDates[0];
    const lastProposalAt = proposalCreatedDates[proposalCreatedDates.length - 1];
    q('[data-dao-updated]').textContent = 'Snapshot · Data through ' + asOf;
    root.querySelectorAll('[data-inline-as-of]').forEach((node) => { node.textContent = asOf; });
    const metrics = [
      ['Indexed proposals', dao.proposalCount],
      ['Active', dao.activeProposalCount],
      ['Participant addresses', formatNumber(dao.metrics.unique_voters), 'is-wide-value'],
      ['Passed', outcomeCounts.passed || 0],
      ['Failed', outcomeCounts.failed || 0],
      ['No quorum', outcomeCounts.no_quorum || 0],
      ['First proposal', firstProposalAt ? formatDate(firstProposalAt) : 'Unavailable', 'is-date'],
      ['Last proposal', lastProposalAt ? formatDate(lastProposalAt) : 'Unavailable', 'is-date'],
    ];
    q('[data-overview-metrics]').innerHTML = metrics.map((m) => '<div class="dao-overview-metric' + (m[2] ? ' ' + escapeHtml(m[2]) : '') + '"><span>' + escapeHtml(m[0]) + '</span><strong>' + escapeHtml(m[1]) + '</strong></div>').join('');
    renderHistogram();
    renderControls();
    renderRows();
    renderTopVoters();
    renderVotingDepth();
    renderTypicalPower();
    renderConcentration();
    renderProposalCreators();
    renderProposalTime();
    const mechanismTrigger = q('[data-governance-mechanism]');
    if (mechanismTrigger && sample.governanceMechanism) {
      mechanismTrigger.addEventListener('click', () => EventPanel.openGovernanceSetup(sample.governanceMechanism, mechanismTrigger));
    }
  }

  function renderHistogram() {
    const months = proposalActivityMonths;
    const max = Math.max(...months.map((bucket) => bucket.proposalCount));
    const midpoint = Math.ceil(max / 2);
    const histogram = q('[data-proposal-histogram]');
    histogram.style.setProperty('--histogram-months', months.length);
    histogram.innerHTML = '<div class="proposal-histogram-y-title" aria-hidden="true">Indexed proposals</div>' +
      '<div class="proposal-histogram-y-axis" aria-hidden="true"><span>' + max + '</span><span>' + midpoint + '</span><span>0</span></div>' +
      '<div class="proposal-histogram-plot" data-proposal-histogram-plot>' +
        '<i class="proposal-histogram-gridline is-top" aria-hidden="true"></i><i class="proposal-histogram-gridline is-mid" aria-hidden="true"></i>' +
        '<output class="proposal-histogram-tooltip" data-proposal-histogram-tooltip aria-live="polite"></output>' +
        months.map((bucket) => '<button class="proposal-histogram-bar" type="button" data-proposal-month="' + escapeHtml(bucket.month) + '" data-proposal-label="' + escapeHtml(formatMonth(bucket.month)) + '" data-histogram-count="' + bucket.proposalCount + '" style="--histogram-height:' + Math.max(6, bucket.proposalCount / max * 100) + '%" aria-label="Open proposal list for ' + escapeHtml(formatMonth(bucket.month)) + ': ' + bucket.proposalCount + ' indexed proposals"><span class="proposal-histogram-month">' + escapeHtml(formatMonth(bucket.month)) + '</span></button>').join('') +
      '</div>';
    const tooltip = histogram.querySelector('[data-proposal-histogram-tooltip]');
    const showTooltip = (button) => {
      tooltip.innerHTML = '<strong>' + escapeHtml(button.dataset.proposalLabel) + '</strong><em>' + escapeHtml(button.dataset.histogramCount) + ' proposals</em><small>Click to open</small>';
      tooltip.classList.add('is-visible');
    };
    const hideTooltip = () => tooltip.classList.remove('is-visible');
    histogram.querySelectorAll('[data-proposal-month]').forEach((button) => {
      button.addEventListener('click', () => openProposalMonth(button.dataset.proposalMonth, button));
      button.addEventListener('pointerenter', () => showTooltip(button));
      button.addEventListener('pointerleave', hideTooltip);
      button.addEventListener('focus', () => showTooltip(button));
      button.addEventListener('blur', hideTooltip);
      button.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const bars = [...histogram.querySelectorAll('[data-proposal-month]')];
        const nextIndex = Math.max(0, Math.min(bars.length - 1, bars.indexOf(button) + (event.key === 'ArrowRight' ? 1 : -1)));
        bars[nextIndex].focus();
      });
    });
  }

  function renderControls() {
    const sources = [...new Set(proposalRows.map((row) => row.source))].sort();
    const select = q('[name="source"]');
    sources.forEach((source) => select.insertAdjacentHTML('beforeend', '<option value="' + escapeHtml(source) + '">' + escapeHtml(source) + '</option>'));
    q('[data-proposal-controls]').addEventListener('input', () => { visibleLimit = 10; renderRows(); });
    q('[data-proposal-controls]').addEventListener('change', () => { visibleLimit = 10; renderRows(); });
    q('[data-proposal-controls]').addEventListener('submit', (event) => event.preventDefault());
    q('[data-proposal-load-more]').addEventListener('click', () => {
      visibleLimit = Math.min(visibleLimit + 20, filteredRows().length);
      renderRows();
    });

  }

  function filteredRows() {
    const form = new FormData(q('[data-proposal-controls]'));
    const search = String(form.get('search') || '').trim().toLowerCase();
    const status = String(form.get('status'));
    const outcome = String(form.get('outcome'));
    const source = String(form.get('source'));
    const sort = String(form.get('sort'));
    const rows = proposalRows.filter((row) => (!search || (row.title + ' ' + row.source).toLowerCase().includes(search)) && (status === 'all' || row.lifecycleStatus === status) && (outcome === 'all' || row.outcome === outcome) && (source === 'all' || row.source === source));
    rows.sort((a,b) => sort === 'oldest' ? new Date(a.createdAt) - new Date(b.createdAt) : sort === 'voters' ? b.participation.uniqueVoters - a.participation.uniqueVoters : sort === 'power' ? Number(b.participation.totalVotingPower) - Number(a.participation.totalVotingPower) : new Date(b.createdAt) - new Date(a.createdAt));
    return rows;
  }

  function renderRows() {
    const rows = filteredRows();
    const visible = rows.slice(0, visibleLimit);
    q('[data-proposal-rows]').innerHTML = visible.map(rowMarkup).join('');
    q('[data-proposal-empty]').hidden = rows.length > 0;
    const load = q('[data-proposal-load-more]');
    load.hidden = visible.length >= rows.length;
    const remaining = Math.max(0, rows.length - visible.length);
    load.textContent = 'Load ' + Math.min(20, remaining) + ' more proposals';
    q('[data-proposal-rows]').querySelectorAll('.proposal-row').forEach((button) => {
      button.addEventListener('click', () => {
        const row = proposalRows.find((item) => item.id === button.dataset.proposalId);
        if (!row) return;
        const detail = sample.proposalDetail && sample.proposalDetail.id === row.id ? { ...row, ...sample.proposalDetail } : row;
        EventPanel.openProposalDecision(detail, button, { eventData: { id: row.id, title: row.title } });
      });
    });
  }

  function rowMarkup(row) {
    const p = row.participation;
    const displayOutcome = row.lifecycleStatus === 'active' ? 'active' : row.outcome;
    const outcomeClass = displayOutcome === 'no_quorum' ? 'no-quorum' : displayOutcome;
    return '<button class="proposal-row" type="button" role="listitem" data-proposal-id="' + escapeHtml(row.id) + '" aria-label="Open indexed proposal: ' + escapeHtml(row.title) + '"><time class="proposal-row-cell proposal-date" datetime="' + escapeHtml(row.createdAt) + '">' + escapeHtml(formatDate(row.createdAt)) + '</time><span class="proposal-row-cell proposal-identity"><strong>' + escapeHtml(row.title) + '</strong></span><span class="proposal-row-cell proposal-participation"><strong>' + formatNumber(p.uniqueVoters) + '</strong><span>voters</span></span><span class="proposal-row-cell proposal-outcome"><span class="proposal-outcome-badge is-' + outcomeClass + '">' + escapeHtml(displayOutcome.replace(/_/g,' ')) + '</span></span></button>';
  }

  const snapshotSource = [{ label: 'Uniswap governance on Snapshot', url: 'https://snapshot.org/#/uniswapgovernance.eth' }];
  const dataAsOf = () => formatDateTime(sample.dao.dataAsOf);

  function openProposalMonth(month, trigger) {
    const bucket = proposalActivityMonths.find((item) => item.month === month);
    if (!bucket) return;
    const records = bucket.proposals
      .map((proposal) => proposalRows.find((row) => row.id === proposal.id) || proposal)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    EventPanel.openProposalActivityMonth({
      title: formatMonthLong(month) + ' proposals',
      proposalCount: bucket.proposalCount,
      month,
      records,
      contextLabel: q('#proposal-activity .eyebrow')?.textContent?.trim(),
      source: snapshotSource[0],
      dataAsOf: dataAsOf(),
    }, trigger);
  }

  function openVoter(address, trigger) {
    const profile = sample.drilldowns.voterProfiles[String(address).toLowerCase()];
    if (!profile) return;
    EventPanel.openEstablishedVoter({
      ...profile,
      contextLabel: q('#top-voters .eyebrow')?.textContent?.trim(),
      source: snapshotSource[0],
      dataAsOf: dataAsOf(),
    }, trigger);
  }

  function openParticipationCohort(index, trigger) {
    const cohort = sample.drilldowns.participationDepthCohorts[index];
    if (!cohort) return;
    EventPanel.openParticipationFrequency({
      ...cohort,
      contextLabel: q('#voting-depth .eyebrow')?.textContent?.trim(),
      source: snapshotSource[0],
      dataAsOf: dataAsOf(),
    }, trigger);
  }

  function openPowerCohort(index, trigger) {
    const cohort = sample.drilldowns.typicalPowerCohorts[index];
    if (!cohort) return;
    EventPanel.openTypicalPower({
      ...cohort,
      contextLabel: q('#power-distribution .eyebrow')?.textContent?.trim(),
      source: snapshotSource[0],
      dataAsOf: dataAsOf(),
    }, trigger);
  }

  function openConcentrationCohort(count, trigger) {
    const data = sample.drilldowns.observedPowerConcentration;
    const point = data.points.find((item) => item.voterCount === count);
    if (!point) return;
    EventPanel.openPowerConcentration({
      selectedCount: count,
      ...point,
      rankedVoterCount: data.rankedVoterCount,
      voteCoveredProposalCount: data.voteCoveredProposalCount,
      topVoters: data.topVoters,
      contextLabel: q('#voter-concentration .eyebrow')?.textContent?.trim(),
      source: snapshotSource[0],
      dataAsOf: dataAsOf(),
    }, trigger);
  }

  function openCreator(address, trigger) {
    const profile = sample.drilldowns.creatorProfiles[String(address).toLowerCase()];
    if (!profile) return;
    EventPanel.openProposalCreator({
      ...profile,
      contextLabel: q('#proposal-creators .eyebrow')?.textContent?.trim(),
      source: snapshotSource[0],
      dataAsOf: dataAsOf(),
    }, trigger);
  }


  function openTimelineProposal(id, trigger) {
    const indexed = sample.drilldowns.indexedProposals.find((row) => row.id === id);
    const base = proposalRows.find((row) => row.id === id) || indexed;
    if (!base) return;
    const detail = sample.proposalDetail && sample.proposalDetail.id === id ? { ...base, ...sample.proposalDetail } : { ...base, choices: base.choices || [], limitations: base.limitations || [] };
    EventPanel.openProposalParticipation(detail, trigger);
  }

  function renderVotingDepth() {
    const cohorts = sample.drilldowns.participationDepthCohorts;
    q('[data-voting-depth-total]').textContent = formatNumber(sample.dao.metrics.unique_voters) + ' participant addresses';
    q('[data-voting-depth]').innerHTML = cohorts.map((bucket, index) => '<button class="voting-depth-bar evidence-trigger" type="button" data-depth-cohort="' + index + '" aria-label="Open evidence for ' + escapeHtml(bucket.label) + ' participation cohort"><span>' + escapeHtml(bucket.label) + '</span><i aria-hidden="true"><b style="--depth-share:' + Math.max(0.8, bucket.share) + '%"></b></i><strong>' + formatNumber(bucket.voterCount) + '</strong><em>' + formatPercent(bucket.share) + '</em></button>').join('');
    q('[data-voting-depth]').querySelectorAll('[data-depth-cohort]').forEach((button) => button.addEventListener('click', () => openParticipationCohort(Number(button.dataset.depthCohort), button)));
  }

  function renderTopVoters() {
    const rows = sample.voterAnalytics.consistentTopVoters.slice(0, 10);
    q('[data-top-voters]').innerHTML = '<div class="top-voter-ledger-row top-voter-ledger-head" aria-hidden="true"><span>#</span><span>Address</span><span>Average Snapshot VP</span><span>Proposals</span></div>' + rows.map((row) => '<button type="button" class="top-voter-ledger-row evidence-ledger-row" data-voter-evidence="' + escapeHtml(row.voterAddress) + '" aria-label="Open evidence for voter ' + escapeHtml(row.voterAddress) + '" title="' + escapeHtml(row.voterAddress) + '"><span class="top-voter-ledger-rank">' + row.establishedRank + '</span><span class="top-voter-address"><span>' + escapeHtml(compactAddress(row.displayLabel)) + '</span></span><span title="' + escapeHtml(row.averageVotingPower) + ' Snapshot VP">' + formatPower(row.averageVotingPowerNum) + ' VP</span><span title="' + row.shareProposalCount + ' of ' + row.analyzedProposalCount + ' covered proposals">' + formatNumber(row.proposalsVoted) + '</span></button>').join('');
    q('[data-top-voters]').querySelectorAll('[data-voter-evidence]').forEach((button) => button.addEventListener('click', () => openVoter(button.dataset.voterEvidence, button)));
  }

  function renderTypicalPower() {
    q('[data-typical-power]').innerHTML = sample.drilldowns.typicalPowerCohorts.map((bucket, index) => '<button type="button" class="typical-power-row evidence-trigger" data-power-cohort="' + index + '" aria-label="Open evidence for average ' + escapeHtml(bucket.label) + ' Snapshot VP cohort"><span>' + escapeHtml(bucket.label) + ' VP</span><i aria-hidden="true"><b style="--power-share:' + Math.max(0.8, bucket.voterSharePercent) + '%"></b></i><strong>' + formatNumber(bucket.voterCount) + ' addresses</strong><em>' + formatPercent(bucket.voterSharePercent) + '</em></button>').join('');
    q('[data-typical-power]').querySelectorAll('[data-power-cohort]').forEach((button) => button.addEventListener('click', () => openPowerCohort(Number(button.dataset.powerCohort), button)));
  }

  function renderConcentration() {
    const data = sample.voterAnalytics.observedPowerConcentration;
    const keys = [1, 5, 10, 25, 100].map((count) => data.points.find((row) => row.voterCount === count)).filter(Boolean);
    q('[data-concentration-highlights]').innerHTML = keys.map((row) => '<button type="button" class="evidence-trigger" data-concentration-cohort="' + row.voterCount + '" aria-label="Open evidence for top ' + row.voterCount + ' observed voting power cohort"><span>Top ' + row.voterCount + '</span><strong>' + formatPercent(row.cumulativeObservedVotingPowerPercent) + '</strong><em>' + formatPercent(row.voterPercent) + ' of participants</em></button>').join('');
    q('[data-concentration-highlights]').querySelectorAll('[data-concentration-cohort]').forEach((button) => button.addEventListener('click', () => openConcentrationCohort(Number(button.dataset.concentrationCohort), button)));
    const width = 820;
    const height = 220;
    const left = 58;
    const right = 20;
    const top = 30;
    const bottom = 40;
    const maxLog = Math.log10(data.rankedVoterCount);
    const point = (row) => [
      left + Math.log10(Math.max(1, row.voterCount)) / maxLog * (width - left - right),
      top + (100 - row.cumulativeObservedVotingPowerPercent) / 100 * (height - top - bottom),
    ];
    const points = data.points.map(point);
    const grid = [0, 25, 50, 75, 100].map((value) => {
      const y = top + (100 - value) / 100 * (height - top - bottom);
      return '<g><line x1="' + left + '" x2="' + (width - right) + '" y1="' + y + '" y2="' + y + '"></line><text x="' + (left - 10) + '" y="' + (y + 4) + '" text-anchor="end">' + value + '%</text></g>';
    }).join('');
    const xTickCounts = [1, 10, 100, 1000, 10000]
      .filter((count) => count <= data.rankedVoterCount && (count === 1 || data.rankedVoterCount / count >= 1.8))
      .concat(data.rankedVoterCount)
      .filter((count, index, values) => values.indexOf(count) === index);
    const xGrid = xTickCounts.map((count, index) => {
      const x = left + Math.log10(Math.max(1, count)) / maxLog * (width - left - right);
      const anchor = index === 0 ? 'start' : index === xTickCounts.length - 1 ? 'end' : 'middle';
      const label = count === data.rankedVoterCount ? formatNumber(count) : count >= 1000 ? formatNumber(count / 1000) + 'k' : formatNumber(count);
      return '<g><line x1="' + x + '" x2="' + x + '" y1="' + top + '" y2="' + (height - bottom) + '" stroke-dasharray="2 5"></line><text x="' + x + '" y="' + (height - 15) + '" text-anchor="' + anchor + '">' + label + '</text></g>';
    }).join('');
    const area = left + ',' + (height - bottom) + ' ' + points.map((item) => item.join(',')).join(' ') + ' ' + (width - right) + ',' + (height - bottom);
    const marks = data.points.map((row, index) => '<circle cx="' + points[index][0] + '" cy="' + points[index][1] + '" r="3"><title>Top ' + formatNumber(row.voterCount) + ' addresses (' + formatPercent(row.voterPercent) + ' of participants) · ' + formatPercent(row.cumulativeObservedVotingPowerPercent) + ' cumulative observed Snapshot VP</title></circle>').join('');
    const keyLabels = keys.map((row) => {
      const index = data.points.indexOf(row);
      const x = points[index][0];
      const y = points[index][1];
      const placeBelow = row.voterCount >= 25;
      return '<g class="concentration-key-label" aria-hidden="true"><circle cx="' + x + '" cy="' + y + '" r="5"></circle><text x="' + (x + 8) + '" y="' + (y + (placeBelow ? 16 : -8)) + '">' + formatPercent(row.cumulativeObservedVotingPowerPercent) + '</text></g>';
    }).join('');
    q('[data-concentration-curve]').innerHTML = '<svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Cumulative share of observed Snapshot voting power by participating address count"><text class="concentration-chart-title" x="' + left + '" y="16">CUMULATIVE OBSERVED VP</text><g class="concentration-grid">' + grid + xGrid + '</g><polygon points="' + area + '" opacity=".55"></polygon><polyline points="' + points.map((item) => item.join(',')).join(' ') + '"></polyline>' + marks + keyLabels + '<text class="concentration-axis-label" x="' + (width - right) + '" y="' + (height - 2) + '" text-anchor="end">RANKED ADDRESSES · LOG SCALE</text></svg>';
  }

  function renderProposalCreators() {
    const data = sample.proposalCreators;
    q('[data-creator-coverage]').textContent = data.matchedSourceProposals + ' of ' + data.backendIndexedProposals + ' linked to creators';
    q('[data-proposal-creators]').innerHTML = '<div class="creator-ledger-row creator-ledger-head" aria-hidden="true"><span>#</span><span>Creator</span><span>Indexed proposals</span><span>Share</span><span>Latest proposal</span></div>' + data.topCreators.slice(0, 5).map((row, index) => '<button type="button" class="creator-ledger-row evidence-ledger-row" data-creator-evidence="' + escapeHtml(row.address) + '" aria-label="Open proposal history for creator ' + escapeHtml(row.address) + '" title="' + escapeHtml(row.address) + '"><span>' + (index + 1) + '</span><span class="creator-address">' + escapeHtml(compactAddress(row.address)) + '</span><span class="creator-count"><strong>' + row.proposals + ' proposals</strong></span><span>' + formatPercent(row.shareOfKnownPercent) + '</span><time datetime="' + escapeHtml(row.latestCreatedAt) + '">' + escapeHtml(formatDate(row.latestCreatedAt)) + '</time></button>').join('');
    q('[data-creator-note]').textContent = 'Top 5 shown · select a creator to see all indexed proposals.';
    q('[data-proposal-creators]').querySelectorAll('[data-creator-evidence]').forEach((button) => button.addEventListener('click', () => openCreator(button.dataset.creatorEvidence, button)));
  }

  function renderProposalTime() {
    const allRows = sample.readyAnalytics.proposalParticipation.series;
    const rows = proposalTimeRange === 'all' ? allRows : allRows.slice(-32);
    q('[data-proposal-time-total]').textContent = formatNumber(allRows.length) + ' proposals';
    const max = Math.max(...rows.map((row) => row.uniqueVoters));
    const tickEvery = proposalTimeRange === 'all' ? 12 : 4;
    q('[data-proposal-time-chart]').innerHTML = '<div class="proposal-time-y" aria-hidden="true"><span>' + formatNumber(max) + '</span><span>' + formatNumber(Math.round(max / 2)) + '</span><span>0</span></div><div class="proposal-time-plot" style="--proposal-count:' + rows.length + '">' + rows.map((row, index) => {
      const outcome = row.lifecycleStatus === 'active' ? 'active' : row.outcome;
      const title = row.title;
      const accessibleLabel = title + ' · ' + formatDateTime(row.eventAt) + ' · ' + row.lifecycleStatus + ' / ' + row.outcome.replace(/_/g, ' ') + ' · ' + formatNumber(row.uniqueVoters) + ' unique voters · ' + formatNumber(row.effectiveBallots) + ' effective ballots';
      return '<button type="button" class="proposal-time-point is-' + escapeHtml(outcome.replace(/_/g, '-')) + '" data-timeline-evidence="' + escapeHtml(row.id) + '" style="--proposal-height:' + Math.max(1, row.uniqueVoters / max * 100) + '%" title="' + escapeHtml(title) + '" aria-label="Open proposal evidence: ' + escapeHtml(accessibleLabel) + '"><i></i>' + (index % tickEvery === 0 || index === rows.length - 1 ? '<time datetime="' + escapeHtml(row.eventAt) + '">' + escapeHtml(formatDate(row.eventAt).slice(0, 7)) + '</time>' : '') + '</button>';
    }).join('') + '</div>';
    q('[data-proposal-time-chart]').querySelectorAll('[data-timeline-evidence]').forEach((button) => button.addEventListener('click', () => openTimelineProposal(button.dataset.timelineEvidence, button)));
  }

}

function initGovernanceFeedProposalDetails() {
  const triggers = [...document.querySelectorAll("[data-feed-proposal-detail]")];
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const subject = trigger.querySelector(".bulletin-subject");
      const daoName = subject?.querySelector(".signal-dao-name")?.textContent?.trim() || "DAO";
      const title = subject?.lastElementChild?.textContent?.trim() || "Governance proposal";
      const id = trigger.dataset.odId || "governance-feed-proposal";
      const lifecycleStatus = trigger.dataset.feedLifecycle || "closed";
      const outcome = trigger.dataset.feedOutcome || "unknown";
      const eventStatus = lifecycleStatus === "active" ? "active" : outcome === "failed" ? "defeated" : outcome;
      const eventData = { id, type: "proposal", daoName, title, status: eventStatus, proposal: null, links: {} };
      const proposalRow = {
        id,
        daoName,
        title,
        source: "governance feed",
        lifecycleStatus,
        outcome,
        choices: [],
        coverageStatus: "Signal-level record",
        limitations: ["This governance feed signal does not include proposal-level vote counts, choice totals, quorum, or source links."],
      };
      EventPanel.open(id, trigger, { eventData, proposalRow });
    });
  });
}

/* ── Bootstrap ────────────────────────────────────────────────────── */

function initAtlasPrototype() {
  initDaoSearch();
  initEventPanelTriggers();
  initGovernanceFeedProposalDetails();
  initOlderProposalsPanel();
  initDaoDataIndex();
  initDaoParticipationExplorer();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAtlasPrototype);
} else {
  initAtlasPrototype();
}
