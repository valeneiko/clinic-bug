# syntax=docker/dockerfile:1.4

ARG DEBIAN_VERSION=bullseye
ARG NODE_VERSION=18.13.0

# ----------------------------
# Base container
# ----------------------------
FROM debian:${DEBIAN_VERSION}-slim AS base
RUN groupadd -r npm

# ----------------------------
# APT Config container
# ----------------------------
FROM base AS apt-config
RUN \
    rm -f \
      /etc/apt/apt.conf.d/docker-clean \
      /etc/apt/apt.conf.d/docker-gzip-indexes && \
    echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache

# ----------------------------
# APT container
# ----------------------------
FROM base AS common
ENV \
    PYTHONDONTWRITEBYTECODE=1

RUN --mount=type=bind,target=/etc/apt/apt.conf.d,source=/etc/apt/apt.conf.d,from=apt-config \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    --mount=type=bind,target=/tmp/library-scripts,source=library-scripts \
    apt update && \
    bash /tmp/library-scripts/common-debian.sh false automatic automatic automatic true false false && \
    find / -name '__pycache__' -type d -exec rm -rf '{}' '+'

# ----------------------------
# Node source container
# ----------------------------
FROM base AS node-src
ENV \
    npm_config_logs_max=0

RUN <<EOT
    export COREPACK_HOME=/node/share/corepack
    export PNPM_HOME=/node/share/pnpm
    export XDG_DATA_HOME=${PNPM_HOME}/data
    export XDG_STATE_HOME=${PNPM_HOME}/state
    export XDG_CACHE_HOME=${PNPM_HOME}/cache

    umask 0002
    mkdir -p ${COREPACK_HOME} ${XDG_DATA_HOME} ${XDG_STATE_HOME} ${XDG_CACHE_HOME}
    chown root:npm ${COREPACK_HOME} ${PNPM_HOME} ${XDG_DATA_HOME} ${XDG_STATE_HOME} ${XDG_CACHE_HOME}
    chmod g+s ${COREPACK_HOME} ${PNPM_HOME} ${XDG_DATA_HOME} ${XDG_STATE_HOME} ${XDG_CACHE_HOME}
EOT

RUN --mount=type=bind,target=/etc/apt/apt.conf.d,source=/etc/apt/apt.conf.d,from=apt-config \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    <<EOT
    export DEBIAN_FRONTEND=noninteractive
    apt update
    apt -y install --no-install-recommends \
      curl \
      ca-certificates \
      xz-utils
    apt autoremove --purge -y
    find / -name '__pycache__' -type d -exec rm -rf '{}' '+'
EOT

ARG NODE_VERSION
RUN --mount=type=cache,id=npm,target=/root/.npm \
    --mount=type=cache,id=node-tar,target=/tmp \
    <<EOT
    dpkgArch="$(dpkg --print-architecture)"
    case "${dpkgArch##*-}" in
      amd64) ARCH='x64';;
      ppc64el) ARCH='ppc64le';;
      s390x) ARCH='s390x';;
      arm64) ARCH='arm64';;
      armhf) ARCH='armv7l';;
      i386) ARCH='x86';;
      *) echo "unsupported architecture"; exit 1 ;;
    esac

    cd /tmp
    node_tar="node-v${NODE_VERSION}-linux-${ARCH}.tar.xz"
    if [ ! -f "${node_tar}" ]; then
      curl -fsSLO --compressed "https://nodejs.org/dist/v${NODE_VERSION}/${node_tar}";
    fi;

    mkdir -p /node
    tar -xJf ${node_tar} -C /node --strip-components=1 --no-same-owner

    export PATH=/node/bin:\$PATH
    npm install --location=global \
      npm@latest \
      corepack@latest
EOT

RUN --mount=type=cache,id=npm,target=/root/.npm \
    <<EOT
    export PATH=/node/bin:\$PATH
    export COREPACK_HOME=/node/share/corepack
    umask 0002
    corepack prepare \
      pnpm@$(npm view pnpm@latest version) \
      --activate
EOT

# ----------------------------
# Node binary container
# ----------------------------
FROM scratch AS node-bin
COPY --link --from=node-src /node /

# ----------------------------
# Node container
# ----------------------------
FROM common AS node
ENV \
    npm_config_logs_max=0 \
    COREPACK_HOME=/usr/local/share/corepack \
    PNPM_HOME=/usr/local/share/pnpm
ENV \
    XDG_DATA_HOME=$PNPM_HOME/data \
    XDG_STATE_HOME=$PNPM_HOME/state \
    XDG_CACHE_HOME=$PNPM_HOME/cache \
    V8_COMPILE_CACHE_CACHE_DIR=/tmp/v8-compile-cache \
    PATH="$PNPM_HOME:$PATH"

RUN <<EOT
    umask 0002
    mkdir -p ${V8_COMPILE_CACHE_CACHE_DIR}
    chown root:npm ${V8_COMPILE_CACHE_CACHE_DIR}
    chmod g+s ${V8_COMPILE_CACHE_CACHE_DIR}
EOT

RUN --mount=type=bind,target=/etc/apt/apt.conf.d,source=/etc/apt/apt.conf.d,from=apt-config \
    --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt update && \
    apt -y install --no-install-recommends make gcc g++ python3-minimal python-is-python3 && \
    find / -name '__pycache__' -type d -exec rm -rf '{}' '+'

COPY --link --from=node-bin / /usr/local

# ----------------------------
# Final container
# ----------------------------
FROM node AS final
RUN \
    mkdir -p \
      /home/vscode/.vscode-server/extensions && \
    chown -R vscode:vscode /home/vscode/.vscode-server

RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
    && mkdir /commandhistory \
    && touch /commandhistory/.bash_history \
    && chown -R vscode:vscode /commandhistory \
    && echo "$SNIPPET" >> "/home/vscode/.bashrc"

RUN --mount=type=bind,target=/tmp/library-scripts,source=library-scripts \
    /tmp/library-scripts/entrypoint-debian.sh

ENTRYPOINT []
