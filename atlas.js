/**
 * File overview: Shared Atlas UI scripts — event and agent capability detail panel,
 * event delegation, focus trapping, keyboard shortcuts, and mock data (Phase 1 static prototype).
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
  let isOpen = false;
  let previousActiveElement = null;

  function init() {
    panel = document.getElementById("event-detail-panel");
    if (!panel) return;
    backdrop = panel.querySelector(".event-panel-backdrop");
    content = panel.querySelector(".event-panel-content");
    closeBtn = panel.querySelector(".event-panel-close");
    bodyEl = panel.querySelector(".event-panel-body");
  }

  function open(eventId, triggerEl) {
    if (isOpen) close(true);

    const eventData = MOCK_EVENTS[eventId];
    if (!eventData) {
      console.warn("EventPanel: no mock data for eventId", eventId);
      return;
    }

    triggerElement = triggerEl;
    previousActiveElement = document.activeElement;

    bodyEl.innerHTML = renderPanelContent(eventData);

    /* Re-query close button — it's rendered dynamically into #event-panel-body */
    closeBtn = bodyEl.querySelector(".event-panel-close");

    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    panel.removeAttribute("inert");

    document.body.style.overflow = "hidden";
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

    document.addEventListener("keydown", handleKeydown);
    backdrop.addEventListener("click", handleBackdropClick);
  }

  function close(silent) {
    if (!isOpen) return;
    silent = silent === true;

    document.removeEventListener("keydown", handleKeydown);
    backdrop.removeEventListener("click", handleBackdropClick);
    if (closeBtn) closeBtn.removeEventListener("click", close);

    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    panel.setAttribute("inert", "");

    document.body.style.overflow = "";
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

  function renderPanelContent(evt) {
    const lines = [];

    /* Close row */
    lines.push('<div class="event-panel-close-row">');
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
    } else if (evt.type === "proposal" || evt.type === "forum") {
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
    lines.push('<div class="event-panel-section-label">AI Summary</div>');
    lines.push('<div class="event-panel-summary event-panel-summary-primary"><p>' + esc(summary) + '</p></div>');

    if (evt.type === "proposal" && evt.proposal) {
      const p = evt.proposal;
      lines.push('<div class="event-panel-section-label">Vote Window</div>');
      lines.push('<div class="event-panel-metric-grid event-panel-metric-grid-simple proposal-window-grid">');
      if (p.totalVotes) lines.push(metricCard("Votes", esc(p.totalVotes), p.uniqueVoters ? esc(fmt(p.uniqueVoters)) + " voters" : ""));
      else if (p.uniqueVoters) lines.push(metricCard("Voters", esc(fmt(p.uniqueVoters)), ""));
      if (p.startAt) lines.push(metricCard("Start", formatPanelDate(p.startAt), ""));
      if (p.endAt) {
        const endingSub = p.endAt > Date.now() ? formatDuration(p.endAt - Date.now()) + " left" : "closed";
        lines.push(metricCard("Ending", formatPanelDate(p.endAt), endingSub));
      }
      lines.push("</div>");
      lines.push(...renderEvidenceLinks(evt, "Quick Links"));
      return lines;
    }

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
    if (!state) return "read model";
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

  return { init, open, close };
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

    const trigger = e.target.closest(triggerSelector);
    if (!trigger) return;

    const eventId = trigger.getAttribute("data-event-id");
    if (!eventId) return;

    e.preventDefault();
    EventPanel.open(eventId, trigger);
  });
}

/* ── Bootstrap ────────────────────────────────────────────────────── */

function initAtlasPrototype() {
  initDaoSearch();
  initEventPanelTriggers();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAtlasPrototype);
} else {
  initAtlasPrototype();
}
